import { type NextRequest, NextResponse } from "next/server"

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

    // Check if we have OpenAI credentials
    if (!process.env.OPENAI_API_KEY || !process.env.ASSISTANT_ID) {
      console.log("Missing OpenAI credentials, using fallback")
      return NextResponse.json({ reply: getBanglaAIResponse(userMessage, !!imageUrl) })
    }

    // Try OpenAI API
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a Bengali language tutor. Respond in Bengali and English mix. Help students learn Bengali grammar, vocabulary, and literature. Use examples and be encouraging.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const aiReply = data.choices[0]?.message?.content

      if (aiReply) {
        console.log("OpenAI response received successfully")
        return NextResponse.json({ reply: aiReply })
      } else {
        throw new Error("No response from OpenAI")
      }
    } catch (openaiError) {
      console.error("OpenAI API failed:", openaiError)
      console.log("Falling back to local response")
      return NextResponse.json({ reply: getBanglaAIResponse(userMessage, !!imageUrl) })
    }
  } catch (error: any) {
    console.error("API Error:", error)
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

function getBanglaAIResponse(userMessage: string, hasImage = false): string {
  if (hasImage) {
    return "**ছবি বিশ্লেষণ:** আপনার পাঠানো ছবিটি দেখে মনে হচ্ছে এটি বাংলা ভাষার একটি গুরুত্বপূর্ণ বিষয়।\n\n**ব্যাখ্যা:** ছবিতে যা দেখানো হয়েছে তা বুঝতে হলে প্রসঙ্গ জানা দরকার।\n\n**পরামর্শ:**\n• ছবির সাথে একটি নির্দিষ্ট প্রশ্ন করুন\n• কোন বিষয়ে সাহায্য চান তা বলুন\n• আরো বিস্তারিত তথ্য দিন\n\nআরো জানতে চাইলে বলুন!\n\n🔊 ভয়েস: ছবি সহ প্রশ্ন করলে আরো ভালো সাহায্য করতে পারব।"
  }

  const responses = [
    '**ব্যাখ্যা:** এটি একটি গুরুত্বপূর্ণ বিষয়। বাংলায় এই নিয়মটি বুঝতে হলে প্রথমে মূল ধারণাটি জানতে হবে।\n\n**উদাহরণ:** যেমন "আমি বই পড়ি" (Ami boi pori) বাক্যে "আমি" (Ami) কর্তা, "বই" (boi) কর্ম এবং "পড়ি" (pori) ক্রিয়া।\n\n**গাণিতিক সূত্র:** $$a^2 + b^2 = c^2$$\n\n**চিত্র:**\nকর্তা → ক্রিয়া → কর্ম\nআমি → পড়ি → বই\n\nআরো জানতে চাইলে বলুন!\n\n🔊 ভয়েস: বাংলা ব্যাকরণে কর্তা, ক্রিয়া ও কর্মের সম্পর্ক বুঝতে হবে।',

    '**ব্যাখ্যা:** চমৎকার প্রশ্ন! এই বিষয়টি নবম-দশম শ্রেণির পাঠ্যক্রমে খুবই গুরুত্বপূর্ণ।\n\n**উদাহরণ:** যেমন "সূর্য পূর্ব দিকে ওঠে" (Surjo purbo dike othe) - এখানে সূর্য ওঠার নিয়মটি প্রকৃতির চিরন্তন সত্য।\n\n**গণিত:** বৃত্তের ক্ষেত্রফল = $\\pi r^2$\n\n**বিশেষ টিপস:**\n• নিয়মিত অনুশীলন করুন\n• উদাহরণ দিয়ে বুঝুন\n• প্রশ্ন করতে দ্বিধা করবেন না\n\nআরো জানতে চাইলে বলুন!\n\n🔊 ভয়েস: নিয়মিত অনুশীলনে বাংলা সহজ হয়ে যাবে।',

    '**ব্যাখ্যা:** এটি একটি সাধারণ ভুল যা অনেকেই করে থাকেন। চলুন সঠিক নিয়মটি শিখি।\n\n**উদাহরণ:**\n✗ ভুল: "আমি স্কুলে যাবো" (Ami school-e jabo)\n✓ সঠিক: "আমি স্কুলে যাব" (Ami school-e jab)\n\n**সমীকরণ:** $x + y = z$ যেখানে $x$ হল কর্তা, $y$ হল ক্রিয়া এবং $z$ হল সম্পূর্ণ বাক্য।\n\n**মনে রাখার কৌশল:**\nভবিষ্যৎ কালে "বো" এর পরিবর্তে "ব" ব্যবহার করুন।\n\nআরো জানতে চাইলে বলুন!\n\n🔊 ভয়েস: ভবিষ্যৎ কালে সঠিক বানান ব্যবহার করা জরুরি।',
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
