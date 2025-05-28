import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import OpenAI from "openai"

// Initialize OpenAI client only if API key is available and not a test key
const openai =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-test-key"
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

// Mock AI responses for testing
const generateMockResponse = (userMessage: string, imageUrl?: string, language = "en") => {
  if (imageUrl) {
    return language === "bn"
      ? "আমি আপনার ছবি দেখেছি। এটি একটি পরীক্ষার ছবি। প্রকৃত ব্যবহারে, আমি ছবির বিষয়বস্তু বিশ্লেষণ করে শিক্ষামূলক তথ্য প্রদান করব। এই ছবি সম্পর্কে আপনি কী জানতে চান?"
      : "I can see your image. This appears to be a test image. In actual usage, I would analyze the image content and provide educational information. What would you like to know about this image?"
  }

  const lowerMessage = userMessage.toLowerCase()

  if (language === "bn") {
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("নমস্কার")) {
      return "নমস্কার! আমি শিক্ষক AI, আপনার বাংলা ভাষা শেখার সহায়ক। আমি আপনাকে বাংলা ব্যাকরণ, শব্দভাণ্ডার, এবং সংস্কৃতি সম্পর্কে সাহায্য করতে পারি। আপনি কী শিখতে চান?"
    } else if (lowerMessage.includes("learn") || lowerMessage.includes("শিখ")) {
      return "চমৎকার! বাংলা শেখার জন্য আমরা মৌলিক বিষয় দিয়ে শুরু করতে পারি। আপনি কি বর্ণমালা, সংখ্যা, নাকি দৈনন্দিন কথোপকথন শিখতে চান?"
    } else if (lowerMessage.includes("grammar") || lowerMessage.includes("ব্যাকরণ")) {
      return "বাংলা ব্যাকরণ খুবই আকর্ষণীয়! বাংলায় ৮টি কারক রয়েছে এবং ক্রিয়াপদের বিভিন্ন রূপ আছে। আপনি কোন বিষয়ে জানতে চান - কারক, ক্রিয়াপদ, নাকি বাক্য গঠন?"
    } else {
      return "আপনার প্রশ্নটি বুঝতে পেরেছি। বাংলা ভাষা শেখার ক্ষেত্রে আমি আপনাকে সাহায্য করতে পারি। আরও নির্দিষ্ট প্রশ্ন করলে আমি আরও ভালো উত্তর দিতে পারব।"
    }
  } else {
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm Shikkhok AI, your Bengali language learning assistant. I can help you with Bengali grammar, vocabulary, pronunciation, and culture. What would you like to learn today?"
    } else if (lowerMessage.includes("learn")) {
      return "Great! I'd love to help you learn Bengali. We can start with basics like the alphabet, numbers, or common phrases. What interests you most?"
    } else if (lowerMessage.includes("grammar")) {
      return "Bengali grammar is fascinating! Bengali has 8 cases (কারক) and verbs change based on tense, person, and formality. Would you like to learn about sentence structure, verb conjugations, or cases?"
    } else if (lowerMessage.includes("alphabet")) {
      return "The Bengali alphabet has 50 letters - 11 vowels (স্বরবর্ণ) and 39 consonants (ব্যঞ্জনবর্ণ). Let's start with the vowels: অ, আ, ই, ঈ, উ, ঊ, ঋ, এ, ঐ, ও, ঔ. Would you like to practice pronunciation?"
    } else if (lowerMessage.includes("numbers")) {
      return "Bengali numbers are: ০ (shunno), ১ (ek), ২ (dui), ৩ (tin), ৪ (char), ৫ (panch), ৬ (chhoy), ৭ (saat), ৮ (aat), ৯ (noy), ১০ (dosh). Try practicing these!"
    } else {
      return "I understand your question about Bengali. As your language learning assistant, I can help with vocabulary, grammar, pronunciation, and cultural context. Feel free to ask me anything specific about Bengali!"
    }
  }
}

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

    // Use real OpenAI API if available, otherwise use mock responses
    if (openai) {
      try {
        let reply = ""

        // If we have an Assistant ID, use the Assistants API
        if (process.env.ASSISTANT_ID && process.env.ASSISTANT_ID !== "asst-test-id") {
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
            while (runStatus.status === "in_progress" || runStatus.status === "queued") {
              await new Promise((resolve) => setTimeout(resolve, 1000))
              runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
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
          throw new Error("No assistant ID, using chat completion")
        }
      } catch (error) {
        // Fallback to regular chat completion if assistant fails
        try {
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
        } catch (chatError) {
          console.error("Chat completion error:", chatError)
          // Final fallback to mock response
          reply = generateMockResponse(userMessage, imageUrl, language)
        }
      }
    } else {
      // Use mock responses when no OpenAI API key is available
      reply = generateMockResponse(userMessage, imageUrl, language)
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
