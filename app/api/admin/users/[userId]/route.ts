import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await requireAdmin()

    const user = await Database.getUserById(params.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const chats = await Database.getUserChats(params.userId)

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      chats: chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        messageCount: chat.messages.length,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null,
      })),
      stats: {
        totalChats: chats.length,
        totalMessages: chats.reduce((sum, chat) => sum + chat.messages.length, 0),
        averageMessagesPerChat:
          chats.length > 0
            ? Math.round((chats.reduce((sum, chat) => sum + chat.messages.length, 0) / chats.length) * 10) / 10
            : 0,
      },
    }

    return NextResponse.json({ user: userDetails })
  } catch (error) {
    console.error("Admin user details error:", error)
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await requireAdmin()

    // In a real implementation, you'd delete the user and all their data
    // For now, we'll just return a success message
    return NextResponse.json({ message: "User deletion not implemented in demo" })
  } catch (error) {
    console.error("Admin delete user error:", error)
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }
}
