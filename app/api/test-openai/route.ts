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
          note: "Please set OPENAI_API_KEY environment variable",
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
          note: "ASSISTANT_ID is optional for basic chat functionality",
        },
      })
    }

    // Test OpenAI API connection
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })

      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "OpenAI API connection successful",
          details: {
            hasApiKey: true,
            hasAssistantId: true,
            apiConnected: true,
          },
        })
      } else {
        return NextResponse.json({
          status: "error",
          message: "OpenAI API connection failed",
          details: {
            hasApiKey: true,
            hasAssistantId: true,
            apiConnected: false,
            statusCode: response.status,
          },
        })
      }
    } catch (apiError) {
      return NextResponse.json({
        status: "error",
        message: "Failed to connect to OpenAI API",
        details: {
          hasApiKey: true,
          hasAssistantId: true,
          apiConnected: false,
          error: apiError instanceof Error ? apiError.message : "Unknown error",
        },
      })
    }
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
