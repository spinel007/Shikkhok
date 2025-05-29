import { NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const stats = await Database.getUserStats()
    const users = await Database.getAllUsers()

    return NextResponse.json({
      stats,
      recentUsers: users.slice(-5).map(async (user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        chatCount: (await Database.getUserChats(user.id)).length,
      })),
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
