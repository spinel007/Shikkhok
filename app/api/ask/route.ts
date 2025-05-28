import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
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
      const chat = await db.getChatById(chatId)
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
      }
      if (chat.user_id !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    let reply = ""

    // Try to use the Assistant API first
    if (process.env.ASSISTANT_ID) {
      try {
        // Create a thread
        const thread = await openai.beta.threads.create()

        // Add the user message to the thread
        let messageContent = userMessage
        if (imageUrl) {
          messageContent = `${userMessage || (language === "bn" ? "এই ছবি সম্পর্কে আমাকে বলুন" : "Tell me about this image")}\n\nImage URL: ${imageUrl}`
        }

        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: messageContent,
        })

        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: process.env.ASSISTANT_ID,
        })

        // Wait for completion
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)

        // Poll for completion (with timeout)
        let attempts = 0
        const maxAttempts = 30 // 30 seconds timeout

        while ((runStatus.status === "in_progress" || runStatus.status === "queued") && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
          attempts++
        }

        if (attempts >= maxAttempts) {
          throw new Error("Assistant API timeout")
        }

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id)
        const assistantMessage = messages.data.find((msg) => msg.role === "assistant")

        if (assistantMessage && assistantMessage.content[0].type === "text") {
          reply = assistantMessage.content[0].text.value
        } else {
          throw new Error("No assistant response found")
        }
      } catch (assistantError) {
        console.error("Assistant API error, falling back to Chat API:", assistantError)
        // Fallback to regular chat completion
        throw assistantError
      }
    } else {
      // Fallback to regular chat completion if no assistant ID
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
        model: imageUrl ? "gpt-4-vision-preview" : "gpt-4",
        messages: messages as any,
        max_tokens: 1000,
      })

      reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process that request."
    }

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
