import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse request body
    const { userMessage, imageUrl, language, chatId } = await request.json()

    if (!userMessage && !imageUrl) {
      return NextResponse.json({ error: "Message or image required" }, { status: 400 })
    }

    // Validate chat belongs to user if chatId is provided
    if (chatId) {
      const chat = await Database.getChatById(chatId)
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
      }
      if (chat.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    // Generate AI response (mock for now)
    let reply = ""

    // Simple response generation based on language
    if (language === "bn") {
      if (imageUrl) {
        reply =
          "আমি আপনার ছবি দেখেছি। এটি সম্পর্কে আমার বিশ্লেষণ হল: এটি একটি সুন্দর ছবি। আপনি কি এই ছবি সম্পর্কে আরও কিছু জানতে চান?"
      } else {
        const greetings = ["হ্যালো", "নমস্কার", "হাই", "শুভেচ্ছা"]
        if (greetings.some((g) => userMessage.toLowerCase().includes(g))) {
          reply = "নমস্কার! আমি শিক্ষক AI, আপনার বাংলা শেখার সহায়ক। আমি কিভাবে আপনাকে সাহায্য করতে পারি?"
        } else if (userMessage.toLowerCase().includes("তুমি কে")) {
          reply =
            "আমি শিক্ষক AI, একটি কৃত্রিম বুদ্ধিমত্তা যা বাংলা ভাষা শেখার জন্য তৈরি করা হয়েছে। আমি আপনাকে বাংলা শব্দ, ব্যাকরণ, এবং বাক্য গঠন শিখতে সাহায্য করতে পারি।"
        } else {
          reply = "আপনার প্রশ্নটি বুঝতে পেরেছি। বাংলা ভাষা শেখার জন্য আপনার আগ্রহ দেখে আমি খুশি। আমি আপনাকে এই বিষয়ে সাহায্য করতে পারি।"
        }
      }
    } else {
      if (imageUrl) {
        reply =
          "I've analyzed your image. Here's what I see: It's a nice picture. Would you like to know more about this image?"
      } else {
        const greetings = ["hello", "hi", "hey", "greetings"]
        if (greetings.some((g) => userMessage.toLowerCase().includes(g))) {
          reply = "Hello! I'm Shikkhok AI, your Bengali language learning assistant. How can I help you today?"
        } else if (userMessage.toLowerCase().includes("who are you")) {
          reply =
            "I am Shikkhok AI, an artificial intelligence designed to help you learn Bengali. I can help you with Bengali vocabulary, grammar, and sentence construction."
        } else {
          reply =
            "I understand your question. I'm glad to see your interest in learning Bengali. I can help you with this topic."
        }
      }
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
