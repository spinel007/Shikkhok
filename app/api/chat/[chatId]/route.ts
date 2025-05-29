import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

// GET /api/chat/[chatId] - Get a specific chat
export async function GET(request: NextRequest, { params }: { params: { chatId: string } }) {
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

    // Get messages for this chat
    const messages = await Database.getMessagesByChatId(params.chatId)

    // Return chat with messages
    return NextResponse.json({
      chat: {
        ...chat,
        messages,
      },
    })
  } catch (error) {
    console.error("Get chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/chat/[chatId] - Update a chat (e.g., title)
export async function PUT(request: NextRequest, { params }: { params: { chatId: string } }) {
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

    const { title } = await request.json()
    await Database.updateChatTitle(params.chatId, title)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/chat/[chatId] - Delete a chat
export async function DELETE(request: NextRequest, { params }: { params: { chatId: string } }) {
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

    await Database.deleteChat(params.chatId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
