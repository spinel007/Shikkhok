import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    await requireAdmin()

    const users = await Database.getAllUsers()

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const chats = await Database.getUserChats(user.id)
        const messageCount = chats.reduce((sum, chat) => sum + chat.messages.length, 0)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          preferences: user.preferences,
          stats: {
            chatCount: chats.length,
            messageCount,
            lastChatDate: chats.length > 0 ? chats[0].updatedAt : null,
          },
        }
      }),
    )

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }
}
