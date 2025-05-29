import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Parse request body safely
    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, password, confirmPassword } = body

    // Validation with detailed error messages
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          error: "All fields are required",
          missing: { name: !name, email: !email, password: !password, confirmPassword: !confirmPassword },
        },
        { status: 400 },
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create user with error handling
    try {
      const user = await createUser(name, email, password)

      // Create session
      await createSession(user.id)

      console.log(`New user registered: ${user.email}`)

      return NextResponse.json(
        {
          message: "Account created successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            preferences: user.preferences,
          },
        },
        { status: 201 },
      )
    } catch (error) {
      console.error("User creation error:", error)

      if (error instanceof Error && error.message === "User already exists") {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }

      return NextResponse.json(
        {
          error: "Failed to create user account",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    // Catch-all error handler to ensure we always return valid JSON
    console.error("Signup route error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
