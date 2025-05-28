import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAdminStats, ensureAdminUser } from "@/lib/admin"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    console.log("Admin dashboard API called")

    // Ensure admin user exists first
    await ensureAdminUser()

    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      console.log("No session found")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("Session found for user:", session.user.email)

    // Check if user is admin
    const adminEmails = ["asiful@shikkhok.ai", "admin@shikkhok-ai.com", "developer@shikkhok-ai.com"]
    const isAdmin = adminEmails.includes(session.user.email)

    if (!isAdmin) {
      console.log("User is not admin:", session.user.email)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    console.log("Admin access verified for:", session.user.email)

    // Get admin stats
    const stats = await getAdminStats()
    console.log("Stats retrieved:", stats)

    // Get all users
    const allUsers = await Database.getAllUsers()
    console.log("Found", allUsers.length, "users")

    // Process recent users
    const recentUsersData = []
    for (const user of allUsers.slice(0, 10)) {
      try {
        const userChats = await Database.getUserChats(user.id)
        const messageCount = userChats.reduce((sum, chat) => sum + chat.messages.length, 0)
        recentUsersData.push({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || null,
          chatCount: userChats.length,
          messageCount,
          preferences: user.preferences || { language: "mixed", theme: "light" },
        })
      } catch (error) {
        console.error("Error processing user:", user.id, error)
      }
    }

    // Sort recent users by creation date
    const recentUsers = recentUsersData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    // Process most active users
    const activeUsersData = []
    for (const user of allUsers) {
      try {
        const userChats = await Database.getUserChats(user.id)
        const messageCount = userChats.reduce((sum, chat) => sum + chat.messages.length, 0)
        activeUsersData.push({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || null,
          chatCount: userChats.length,
          messageCount,
          preferences: user.preferences || { language: "mixed", theme: "light" },
        })
      } catch (error) {
        console.error("Error processing active user:", user.id, error)
      }
    }

    // Sort by message count and take top 5
    const mostActiveUsers = activeUsersData.sort((a, b) => b.messageCount - a.messageCount).slice(0, 5)

    const responseData = {
      success: true,
      stats,
      recentUsers,
      mostActiveUsers,
      systemInfo: {
        totalStorage: "In-Memory Database",
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
      },
    }

    console.log("Returning dashboard data successfully")
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Admin dashboard error:", error)

    // Return a proper JSON error response
    const errorResponse = {
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
