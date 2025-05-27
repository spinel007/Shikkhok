import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

// Simple in-memory storage for demo (in production, use a real database)
const users: Map<string, { password: string; user: User }> = new Map()

// Session storage (in production, use Redis or database)
const sessions: Map<string, { userId: string; expiresAt: Date }> = new Map()

export function hashPassword(password: string): string {
  // Simple hash for demo (in production, use bcrypt)
  return Buffer.from(password).toString("base64")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  // Check if user already exists
  for (const [, userData] of users) {
    if (userData.user.email === email) {
      throw new Error("User already exists")
    }
  }

  const user: User = {
    id: Math.random().toString(36).substring(2),
    name,
    email,
    createdAt: new Date().toISOString(),
  }

  users.set(user.id, {
    password: hashPassword(password),
    user,
  })

  return user
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  for (const [, userData] of users) {
    if (userData.user.email === email && verifyPassword(password, userData.password)) {
      return userData.user
    }
  }
  return null
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  sessions.set(sessionId, { userId, expiresAt })

  const cookieStore = await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })

  return sessionId
}

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) return null

  const session = sessions.get(sessionId)
  if (!session || session.expiresAt < new Date()) {
    if (session) sessions.delete(sessionId)
    return null
  }

  const userData = users.get(session.userId)
  if (!userData) return null

  return { user: userData.user }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (sessionId) {
    sessions.delete(sessionId)
    cookieStore.delete("session")
  }
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session.user
}
