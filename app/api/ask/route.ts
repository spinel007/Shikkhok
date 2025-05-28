import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    // Prepare system message based on language
    const systemMessage =
      language === "bn"
        ? "আপনি শিক্ষক AI, একটি সহায়ক AI সহকারী যা বাংলা ভাষা শেখাতে সাহায্য করে। আপনি বাংলা ভাষা, ব্যাকরণ, শব্দভাণ্ডার, এবং সংস্কৃতি সম্পর্কে প্রশ্নের উত্তর দিতে পারেন। যদি ছবি দেওয়া হয়, তাহলে ছবি সম্পর্কে বাংলায় বর্ণনা করুন এবং এটি সম্পর্কে শিক্ষামূলক তথ্য প্রদান করুন।"
        : "You are Shikkhok AI, a helpful AI assistant that helps teach the Bengali language. You can answer questions about Bengali language, grammar, vocabulary, and culture. If an image is provided, describe the image and provide educational information about it."

    // Prepare messages for OpenAI API
    const messages = [{ role: "system", content: systemMessage }]

    // Add user message with image if provided
    if (imageUrl) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: userMessage || (language === "bn" ? "এই ছবি সম্পর্কে আমাকে বলুন" : "Tell me about this image"),
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      })
    } else {
      messages.push({ role: "user", content: userMessage })
    }

    // Call OpenAI API with GPT-4 Vision model
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview", // Use GPT-4 Vision model for image analysis
      messages: messages as any,
      max_tokens: 1000,
    })

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process that request."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
