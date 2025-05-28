// Mock database for demo purposes
// In a real app, this would be replaced with a real database like MongoDB, PostgreSQL, etc.

import { v4 as uuidv4 } from "uuid"

// Type definitions
export interface DbUser {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be a hashed password
  createdAt: string
  lastLogin?: string
  preferences: {
    language: string
    theme: string
  }
}

interface DbSession {
  id: string
  userId: string
  createdAt: string
  expiresAt: string
}

interface DbChat {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

interface DbMessage {
  id: string
  chatId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

// In-memory storage
const users: DbUser[] = []
const sessions: DbSession[] = []
const chats: DbChat[] = []
const messages: DbMessage[] = []

// Initialize with a demo user
if (users.length === 0) {
  users.push({
    id: "demo-user-1",
    name: "Demo User",
    email: "demo@example.com",
    password: "ZGVtb19wYXNzd29yZHNoaWtraG9rX3NhbHQ=", // "demo_password" hashed
    createdAt: new Date().toISOString(),
    preferences: {
      language: "en",
      theme: "light",
    },
  })

  // Add admin user
  users.push({
    id: "admin-user",
    name: "Admin User",
    email: "asiful@shikkhok.ai",
    password: "MTIzNDU2", // "123456" hashed
    createdAt: new Date().toISOString(),
    preferences: {
      language: "en",
      theme: "light",
    },
  })
}

// Database operations
export const Database = {
  // User operations
  async getAllUsers(): Promise<DbUser[]> {
    return [...users]
  },

  async getUserById(id: string): Promise<DbUser | null> {
    return users.find((user) => user.id === id) || null
  },

  async getUserByEmail(email: string): Promise<DbUser | null> {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
  },

  async createUser(name: string, email: string, password: string): Promise<DbUser> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser: DbUser = {
      id: uuidv4(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      preferences: {
        language: "en",
        theme: "light",
      },
    }

    users.push(newUser)
    return newUser
  },

  async updateUserPreferences(userId: string, preferences: Partial<DbUser["preferences"]>): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    user.preferences = {
      ...user.preferences,
      ...preferences,
    }
  },

  async updateUserLastLogin(userId: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    user.lastLogin = new Date().toISOString()
  },

  // Session operations
  async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    sessions.push({
      id: sessionId,
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })

    return sessionId
  },

  async getSession(sessionId: string): Promise<{ userId: string } | null> {
    const session = sessions.find((s) => s.id === sessionId)
    if (!session) return null

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await this.deleteSession(sessionId)
      return null
    }

    return { userId: session.userId }
  },

  async deleteSession(sessionId: string): Promise<void> {
    const index = sessions.findIndex((s) => s.id === sessionId)
    if (index !== -1) {
      sessions.splice(index, 1)
    }
  },

  // Chat operations
  async createChat(userId: string, title: string): Promise<DbChat> {
    const now = new Date().toISOString()
    const newChat: DbChat = {
      id: uuidv4(),
      userId,
      title,
      createdAt: now,
      updatedAt: now,
    }

    chats.push(newChat)
    return newChat
  },

  async getChatsByUserId(userId: string): Promise<DbChat[]> {
    return chats.filter((chat) => chat.userId === userId)
  },

  async getChatById(chatId: string): Promise<DbChat | null> {
    return chats.find((chat) => chat.id === chatId) || null
  },

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chat = await this.getChatById(chatId)
    if (!chat) {
      throw new Error("Chat not found")
    }

    chat.title = title
    chat.updatedAt = new Date().toISOString()
  },

  async deleteChat(chatId: string): Promise<void> {
    const index = chats.findIndex((c) => c.id === chatId)
    if (index !== -1) {
      chats.splice(index, 1)

      // Delete associated messages
      const chatMessages = await this.getMessagesByChatId(chatId)
      for (const message of chatMessages) {
        await this.deleteMessage(message.id)
      }
    }
  },

  // Message operations
  async createMessage(chatId: string, role: "user" | "assistant", content: string): Promise<DbMessage> {
    const newMessage: DbMessage = {
      id: uuidv4(),
      chatId,
      role,
      content,
      createdAt: new Date().toISOString(),
    }

    messages.push(newMessage)

    // Update chat's updatedAt
    const chat = await this.getChatById(chatId)
    if (chat) {
      chat.updatedAt = newMessage.createdAt
    }

    return newMessage
  },

  async getMessagesByChatId(chatId: string): Promise<DbMessage[]> {
    return messages.filter((message) => message.chatId === chatId)
  },

  async getMessageById(messageId: string): Promise<DbMessage | null> {
    return messages.find((message) => message.id === messageId) || null
  },

  async deleteMessage(messageId: string): Promise<void> {
    const index = messages.findIndex((m) => m.id === messageId)
    if (index !== -1) {
      messages.splice(index, 1)
    }
  },

  // Admin operations
  async getStats(): Promise<{
    totalUsers: number
    totalChats: number
    totalMessages: number
    activeUsers: number
  }> {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const activeUsers = users.filter((user) => user.lastLogin && new Date(user.lastLogin) > thirtyDaysAgo).length

    return {
      totalUsers: users.length,
      totalChats: chats.length,
      totalMessages: messages.length,
      activeUsers,
    }
  },

  async getUserStats(userId: string): Promise<{
    totalChats: number
    totalMessages: number
    firstChatDate: string | null
    lastChatDate: string | null
  }> {
    const userChats = await this.getChatsByUserId(userId)
    let totalMessages = 0
    let firstChatDate: string | null = null
    let lastChatDate: string | null = null

    for (const chat of userChats) {
      const chatMessages = await this.getMessagesByChatId(chat.id)
      totalMessages += chatMessages.length

      if (!firstChatDate || chat.createdAt < firstChatDate) {
        firstChatDate = chat.createdAt
      }

      if (!lastChatDate || chat.updatedAt > lastChatDate) {
        lastChatDate = chat.updatedAt
      }
    }

    return {
      totalChats: userChats.length,
      totalMessages,
      firstChatDate,
      lastChatDate,
    }
  },

  // For debugging
  async resetDatabase(): Promise<void> {
    users.length = 0
    sessions.length = 0
    chats.length = 0
    messages.length = 0

    // Re-add demo user
    users.push({
      id: "demo-user-1",
      name: "Demo User",
      email: "demo@example.com",
      password: "ZGVtb19wYXNzd29yZHNoaWtraG9rX3NhbHQ=", // "demo_password" hashed
      createdAt: new Date().toISOString(),
      preferences: {
        language: "en",
        theme: "light",
      },
    })
  },
}
