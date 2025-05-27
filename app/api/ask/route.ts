import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: NextRequest) {
  console.log("=== API Route Debug Info ===")
  console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
  console.log("ASSISTANT_ID exists:", !!process.env.ASSISTANT_ID)
  console.log("Environment:", process.env.NODE_ENV)

  try {
    const { userMessage, imageUrl } = await req.json()
    console.log("Request received:", {
      hasMessage: !!userMessage,
      hasImage: !!imageUrl,
      messageLength: userMessage?.length,
    })

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if OpenAI is properly configured
    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OpenAI API key not found, using fallback")
      return NextResponse.json({ reply: getBanglaAIResponse(userMessage) })
    }

    if (!process.env.ASSISTANT_ID) {
      console.log("❌ Assistant ID not found, using fallback")
      return NextResponse.json({ reply: getBanglaAIResponse(userMessage) })
    }

    console.log("✅ All checks passed, attempting OpenAI API call...")

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000, // 30 second timeout
    })

    console.log("Attempting to create thread...")

    // Create a new thread for this conversation
    const thread = await openai.beta.threads.create()
    console.log("Thread created:", thread.id)

    // Prepare message content
    const messageContent: any = {
      role: "user" as const,
      content: userMessage,
    }

    // If image is provided, add it to the message
    if (imageUrl) {
      messageContent.content = [
        {
          type: "text",
          text: userMessage,
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
      ]
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, messageContent)
    console.log("Message added to thread")

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID!,
    })
    console.log("Run created:", run.id)

    // Wait for the run to complete
    let status = "queued"
    let attempts = 0
    const maxAttempts = 15 // 30 seconds timeout (2 seconds * 15)

    while (status !== "completed" && attempts < maxAttempts) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      status = runStatus.status
      console.log(`Run status: ${status}, attempt: ${attempts + 1}`)

      if (status === "failed") {
        console.error("Assistant run failed")
        return NextResponse.json({ reply: getBanglaAIResponse(userMessage) })
      }

      if (status === "requires_action") {
        console.log("Run requires action - not implemented")
        break
      }

      if (status !== "completed") {
        await new Promise((r) => setTimeout(r, 2000))
        attempts++
      }
    }

    if (attempts >= maxAttempts) {
      console.log("Request timeout, using fallback")
      return NextResponse.json({ reply: getBanglaAIResponse(userMessage) })
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id)
    const assistantMessage = messages.data.find((msg) => msg.role === "assistant")

    if (!assistantMessage || !assistantMessage.content[0]) {
      console.log("No response from assistant, using fallback")
      return NextResponse.json({ reply: getBanglaAIResponse(userMessage) })
    }

    const reply =
      assistantMessage.content[0].type === "text"
        ? assistantMessage.content[0].text.value
        : "Sorry, I could not process your request."

    console.log("Successfully got AI response")
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("OpenAI API Error:", error)

    // Return detailed error information for debugging
    return NextResponse.json({
      reply: getBanglaAIResponse("সাহায্য চাই"),
      debug: {
        error: error.message,
        type: error.constructor.name,
        hasApiKey: !!process.env.OPENAI_API_KEY,
        hasAssistantId: !!process.env.ASSISTANT_ID,
      },
    })
  }
}

// Enhanced fallback function
function getBanglaAIResponse(userMessage: string): string {
  const responses = [
    `**ব্যাখ্যা:** এটি একটি গুরুত্বপূর্ণ বিষয়। বাংলায় এই নিয়মটি বুঝতে হলে প্রথমে মূল ধারণাটি জানতে হবে।

**উদাহরণ:** যেমন "আমি বই পড়ি" (Ami boi pori) বাক্যে "আমি" (Ami) কর্তা, "বই" (boi) কর্ম এবং "পড়ি" (pori) ক্রিয়া।

**গাণিতিক সূত্র:** $$a^2 + b^2 = c^2$$

**চিত্র:**
কর্তা → ক্রিয়া → কর্ম
আমি → পড়ি → বই

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: বাংলা ব্যাকরণে কর্তা, ক্রিয়া ও কর্মের সম্পর্ক বুঝতে হবে।`,

    `**ব্যাখ্যা:** চমৎকার প্রশ্ন! এই বিষয়টি নবম-দশম শ্রেণির পাঠ্যক্রমে খুবই গুরুত্বপূর্ণ।

**উদাহরণ:** যেমন "সূর্য পূর্ব দিকে ওঠে" (Surjo purbo dike othe) - এখানে সূর্য ওঠার নিয়মটি প্রকৃতির চিরন্তন সত্য।

**গণিত:** বৃত্তের ক্ষেত্রফল = $\\pi r^2$

**বিশেষ টিপস:**
• নিয়মিত অনুশীলন করুন
• উদাহরণ দিয়ে বুঝুন  
• প্রশ্ন করতে দ্বিধা করবেন না

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: নিয়মিত অনুশীলনে বাংলা সহজ হয়ে যাবে।`,

    `**ব্যাখ্যা:** এটি একটি সাধারণ ভুল যা অনেকেই করে থাকেন। চলুন সঠিক নিয়মটি শিখি।

**উদাহরণ:** 
✗ ভুল: "আমি স্কুলে যাবো" (Ami school-e jabo)
✓ সঠিক: "আমি স্কুলে যাব" (Ami school-e jab)

**সমীকরণ:** $x + y = z$ যেখানে $x$ হল কর্তা, $y$ হল ক্রিয়া এবং $z$ হল সম্পূর্ণ বাক্য।

**মনে রাখার কৌশল:**
ভবিষ্যৎ কালে "বো" এর পরিবর্তে "ব" ব্যবহার করুন।

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: ভবিষ্যৎ কালে সঠিক বানান ব্যবহার করা জরুরি।`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
