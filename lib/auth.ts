import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Database } from "./database"

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  preferences?: {
    language: "bn" | "en" | "mixed"
    theme: "light" | "dark"
  }
}

export function hashPassword(password: string): string {
  // Simple hash for demo (in production, use bcrypt)
  return Buffer.from(password).toString("base64")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  try {
    const hashedPassword = hashPassword(password)
    const dbUser = await Database.createUser(name, email, hashedPassword)

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      preferences: dbUser.preferences,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error // Re-throw to be handled by the API route
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const dbUser = await Database.getUserByEmail(email)
    if (!dbUser || !verifyPassword(password, dbUser.password)) {
      return null
    }

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      preferences: dbUser.preferences,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  try {
    const sessionId = await Database.createSession(userId)

    const cookieStore = cookies()
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    return sessionId
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) return null

    const session = await Database.getSession(sessionId)
    if (!session) return null

    const dbUser = await Database.getUserById(session.userId)
    if (!dbUser) return null

    return {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
        preferences: dbUser.preferences,
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
    const sessionId = cookieStore.get("session")?.value

    if (sessionId) {
      await Database.deleteSession(sessionId)
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

export async function updateUserPreferences(userId: string, preferences: Partial<User["preferences"]>): Promise<void> {
  try {
    await Database.updateUserPreferences(userId, preferences)
  } catch (error) {
    console.error("Error updating user preferences:", error)
    throw error
  }
}

// Admin check function
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession()
    if (!session) {
      console.log("No session found for admin check")
      return false
    }

    console.log("Checking admin access for:", session.user.email)

    // Admin emails
    const ADMIN_EMAILS = ["admin@shikkhok-ai.com", "developer@shikkhok-ai.com", "asiful@shikkhok.ai"]

    const isAdminUser = ADMIN_EMAILS.includes(session.user.email)
    console.log("Admin check result:", isAdminUser)
    return isAdminUser
  } catch (error) {
    console.error("Admin check error:", error)
    return false
  }
}
