import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Check database connection
    const dbResult = await db.query("SELECT 1")

    // Return health status
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        services: {
          database: dbResult ? "connected" : "error",
          api: "running",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        services: {
          database: "error",
          api: "running",
        },
      },
      { status: 500 },
    )
  }
}
