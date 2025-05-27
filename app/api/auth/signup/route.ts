import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json()

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
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

    // Create user
    const user = await createUser(name, email, password)

    // Create session
    await createSession(user.id)

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
