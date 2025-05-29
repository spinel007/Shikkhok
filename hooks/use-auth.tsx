"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  // Improve the checkAuth function to handle errors better and add retry logic
  const checkAuth = async () => {
    let retries = 3

    while (retries > 0) {
      try {
        const response = await fetch("/api/auth/me", {
          // Add cache: 'no-store' to prevent caching issues
          cache: "no-store",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          return // Success, exit the retry loop
        } else if (response.status === 401) {
          console.log("Not authenticated, clearing user state")
          setUser(null)
          return // Expected error, exit the retry loop
        } else {
          console.error("Auth check failed with status:", response.status)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      }

      retries--
      if (retries > 0) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, (3 - retries) * 1000))
      }
    }

    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Signup failed")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
