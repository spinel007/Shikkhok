import { getSession } from "./auth"
import { Database } from "./database"

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession()
    if (!session) {
      return false
    }

    const adminEmails = ["asiful@shikkhok.ai", "admin@shikkhok-ai.com", "developer@shikkhok-ai.com"]
    return adminEmails.includes(session.user.email)
  } catch (error) {
    console.error("Admin check error:", error)
    return false
  }
}

export async function requireAdmin() {
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    throw new Error("Admin access required")
  }
  return true
}

export interface AdminStats {
  users: {
    total: number
    active: number
    newToday: number
    newThisWeek: number
    newThisMonth: number
  }
  chats: {
    total: number
    todayCount: number
    weekCount: number
    monthCount: number
    averagePerUser: number
  }
  messages: {
    total: number
    todayCount: number
    weekCount: number
    monthCount: number
    averagePerChat: number
  }
  sessions: {
    active: number
    totalToday: number
  }
  growth: {
    userGrowthRate: number
    chatGrowthRate: number
    messageGrowthRate: number
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const users = await Database.getAllUsers()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // User stats
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.lastLogin && new Date(user.lastLogin) > weekAgo).length
    const newUsersToday = users.filter((user) => new Date(user.createdAt) >= today).length
    const newUsersWeek = users.filter((user) => new Date(user.createdAt) >= weekAgo).length
    const newUsersMonth = users.filter((user) => new Date(user.createdAt) >= monthAgo).length

    // Initialize chat and message counters
    let totalChats = 0
    let totalMessages = 0
    let chatsToday = 0
    let chatsWeek = 0
    let chatsMonth = 0
    let messagesToday = 0
    let messagesWeek = 0
    let messagesMonth = 0

    // Process each user's chats and messages
    for (const user of users) {
      try {
        const userChats = await Database.getUserChats(user.id)
        totalChats += userChats.length

        for (const chat of userChats) {
          const chatDate = new Date(chat.createdAt)
          if (chatDate >= today) chatsToday++
          if (chatDate >= weekAgo) chatsWeek++
          if (chatDate >= monthAgo) chatsMonth++

          totalMessages += chat.messages.length

          for (const message of chat.messages) {
            const messageDate = new Date(message.timestamp)
            if (messageDate >= today) messagesToday++
            if (messageDate >= weekAgo) messagesWeek++
            if (messageDate >= monthAgo) messagesMonth++
          }
        }
      } catch (error) {
        console.error("Error processing user chats:", user.id, error)
      }
    }

    // Calculate growth rates
    const userGrowthRate = totalUsers > 0 ? Math.round((newUsersWeek / totalUsers) * 100 * 10) / 10 : 0
    const chatGrowthRate = totalChats > 0 ? Math.round((chatsWeek / totalChats) * 100 * 10) / 10 : 0
    const messageGrowthRate = totalMessages > 0 ? Math.round((messagesWeek / totalMessages) * 100 * 10) / 10 : 0

    // Get session stats
    const sessionStats = await Database.getUserStats()

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersWeek,
        newThisMonth: newUsersMonth,
      },
      chats: {
        total: totalChats,
        todayCount: chatsToday,
        weekCount: chatsWeek,
        monthCount: chatsMonth,
        averagePerUser: totalUsers > 0 ? Math.round((totalChats / totalUsers) * 10) / 10 : 0,
      },
      messages: {
        total: totalMessages,
        todayCount: messagesToday,
        weekCount: messagesWeek,
        monthCount: messagesMonth,
        averagePerChat: totalChats > 0 ? Math.round((totalMessages / totalChats) * 10) / 10 : 0,
      },
      sessions: {
        active: sessionStats.activeSessions,
        totalToday: sessionStats.activeSessions,
      },
      growth: {
        userGrowthRate,
        chatGrowthRate,
        messageGrowthRate,
      },
    }
  } catch (error) {
    console.error("Error getting admin stats:", error)
    // Return default stats if there's an error
    return {
      users: { total: 0, active: 0, newToday: 0, newThisWeek: 0, newThisMonth: 0 },
      chats: { total: 0, todayCount: 0, weekCount: 0, monthCount: 0, averagePerUser: 0 },
      messages: { total: 0, todayCount: 0, weekCount: 0, monthCount: 0, averagePerChat: 0 },
      sessions: { active: 0, totalToday: 0 },
      growth: { userGrowthRate: 0, chatGrowthRate: 0, messageGrowthRate: 0 },
    }
  }
}

// Helper function to ensure admin user exists
export async function ensureAdminUser(): Promise<void> {
  try {
    const existingUser = await Database.getUserByEmail("asiful@shikkhok.ai")
    if (!existingUser) {
      console.log("Creating admin user: asiful@shikkhok.ai")
      const hashedPassword = Buffer.from("123456").toString("base64")
      await Database.createUser("Asiful Rahman", "asiful@shikkhok.ai", hashedPassword)
      console.log("Admin user created successfully")
    } else {
      console.log("Admin user already exists:", existingUser.email)
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error)
  }
}
