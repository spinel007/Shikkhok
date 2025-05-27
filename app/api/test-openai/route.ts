import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  try {
    console.log("Testing OpenAI configuration...")

    // Check environment variables
    const hasApiKey = !!process.env.OPENAI_API_KEY
    const hasAssistantId = !!process.env.ASSISTANT_ID

    console.log("API Key exists:", hasApiKey)
    console.log("Assistant ID exists:", hasAssistantId)

    if (!hasApiKey) {
      return NextResponse.json({
        status: "error",
        message: "OPENAI_API_KEY not found",
        details: {
          hasApiKey: false,
          hasAssistantId,
        },
      })
    }

    if (!hasAssistantId) {
      return NextResponse.json({
        status: "error",
        message: "ASSISTANT_ID not found",
        details: {
          hasApiKey: true,
          hasAssistantId: false,
        },
      })
    }

    // Test OpenAI connection
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 10000,
    })

    // Test basic API call
    console.log("Testing OpenAI API connection...")
    const models = await openai.models.list()
    console.log("✅ OpenAI API connection successful")

    // Test Assistant retrieval
    console.log("Testing Assistant retrieval...")
    const assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_ID!)
    console.log("✅ Assistant found:", assistant.name)

    return NextResponse.json({
      status: "success",
      message: "OpenAI configuration is working correctly",
      details: {
        hasApiKey: true,
        hasAssistantId: true,
        apiConnection: true,
        assistantName: assistant.name,
        assistantModel: assistant.model,
        modelsCount: models.data.length,
      },
    })
  } catch (error: any) {
    console.error("❌ OpenAI test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "OpenAI test failed",
        error: error.message,
        details: {
          hasApiKey: !!process.env.OPENAI_API_KEY,
          hasAssistantId: !!process.env.ASSISTANT_ID,
          errorType: error.constructor.name,
        },
      },
      { status: 500 },
    )
  }
}
