import { type NextRequest, NextResponse } from "next/server"
import { getSession, updateUserPreferences } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { language, theme } = await request.json()

    await updateUserPreferences(session.user.id, { language, theme })

    return NextResponse.json({ message: "Preferences updated successfully" })
  } catch (error) {
    console.error("Update preferences error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
