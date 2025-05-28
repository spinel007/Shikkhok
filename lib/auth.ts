import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "./db"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  avatar_url?: string
  createdAt: string
  preferences?: {
    language: string
    theme: string
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  try {
    const dbUser = await db.createUser(name, email, password)

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      location: dbUser.location,
      bio: dbUser.bio,
      avatar_url: dbUser.avatar_url,
      createdAt: dbUser.created_at.toISOString(),
      preferences: {
        language: dbUser.language,
        theme: dbUser.theme,
      },
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const dbUser = await db.verifyPassword(email, password)
    if (!dbUser) return null

    // Update last login
    await db.updateLastLogin(dbUser.id)

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      location: dbUser.location,
      bio: dbUser.bio,
      avatar_url: dbUser.avatar_url,
      createdAt: dbUser.created_at.toISOString(),
      preferences: {
        language: dbUser.language,
        theme: dbUser.theme,
      },
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  try {
    const sessionToken = await db.createSession(userId)

    const cookieStore = cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    })

    return sessionToken
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      console.log("No session cookie found")
      return null
    }

    const session = await db.getSession(sessionToken)
    if (!session) {
      console.log("No valid session found for token")
      return null
    }

    const dbUser = await db.getUserById(session.user_id)
    if (!dbUser) {
      console.log("No user found for session")
      return null
    }

    return {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        location: dbUser.location,
        bio: dbUser.bio,
        avatar_url: dbUser.avatar_url,
        createdAt: dbUser.created_at.toISOString(),
        preferences: {
          language: dbUser.language,
          theme: dbUser.theme,
        },
      },
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (sessionToken) {
      await db.deleteSession(sessionToken)
      cookieStore.delete("session")
    }
  } catch (error) {
    console.error("Error destroying session:", error)
  }
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session.user
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const dbUpdates: any = {}

    if (updates.name) dbUpdates.name = updates.name
    if (updates.phone) dbUpdates.phone = updates.phone
    if (updates.location) dbUpdates.location = updates.location
    if (updates.bio) dbUpdates.bio = updates.bio
    if (updates.avatar_url) dbUpdates.avatar_url = updates.avatar_url
    if (updates.preferences?.language) dbUpdates.language = updates.preferences.language
    if (updates.preferences?.theme) dbUpdates.theme = updates.preferences.theme

    const updatedUser = await db.updateUser(userId, dbUpdates)
    if (!updatedUser) return null

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      bio: updatedUser.bio,
      avatar_url: updatedUser.avatar_url,
      createdAt: updatedUser.created_at.toISOString(),
      preferences: {
        language: updatedUser.language,
        theme: updatedUser.theme,
      },
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
}

// Admin check function
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession()
    if (!session) return false

    const ADMIN_EMAILS = ["admin@shikkhok-ai.com", "developer@shikkhok-ai.com", "asiful@shikkhok.ai"]
    return ADMIN_EMAILS.includes(session.user.email)
  } catch (error) {
    console.error("Admin check error:", error)
    return false
  }
}
