import { NextResponse } from "next/server"

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

    // For deployment stability, just return success if env vars exist
    return NextResponse.json({
      status: "success",
      message: "Environment variables are configured",
      details: {
        hasApiKey: true,
        hasAssistantId: true,
        note: "OpenAI API testing disabled for deployment stability",
      },
    })
  } catch (error: any) {
    console.error("Test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Configuration test failed",
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
