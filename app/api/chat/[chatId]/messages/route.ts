import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

// POST /api/chat/[chatId]/messages - Add a message to a chat
export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const chat = await Database.getChatById(params.chatId)
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Check if the chat belongs to the user
    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { content, role, imageUrl } = await request.json()
    const message = await Database.createMessage(params.chatId, role, content)

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Add message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
