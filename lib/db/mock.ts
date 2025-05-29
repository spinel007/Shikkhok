// Enhanced mock database for complete testing with AI support
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

// Mock data storage
const mockUsers = new Map()
const mockSessions = new Map()
const mockChats = new Map()
const mockMessages = new Map()

// Initialize with test data
const initializeTestData = async () => {
  // Create test users
  const testUsers = [
    {
      id: "test-user-1",
      name: "Test User",
      email: "test@example.com",
      password_hash: await bcrypt.hash("password", 10),
      language: "en",
      theme: "light",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "admin-user-1",
      name: "Admin User",
      email: "admin@test.com",
      password_hash: await bcrypt.hash("admin123", 10),
      language: "en",
      theme: "dark",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  testUsers.forEach((user) => {
    mockUsers.set(user.email, user)
    mockUsers.set(user.id, user)
  })

  // Create test chats
  const testChats = [
    {
      id: "chat-1",
      user_id: "test-user-1",
      title: "Bengali Learning Chat",
      created_at: new Date(Date.now() - 86400000), // 1 day ago
      updated_at: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "chat-2",
      user_id: "test-user-1",
      title: "Image Analysis Test",
      created_at: new Date(Date.now() - 43200000), // 12 hours ago
      updated_at: new Date(Date.now() - 1800000), // 30 minutes ago
    },
  ]

  testChats.forEach((chat) => {
    mockChats.set(chat.id, chat)
  })

  // Create test messages
  const testMessages = [
    {
      id: "msg-1",
      chat_id: "chat-1",
      role: "user",
      content: "Hello, I want to learn Bengali",
      created_at: new Date(Date.now() - 86400000),
    },
    {
      id: "msg-2",
      chat_id: "chat-1",
      role: "assistant",
      content:
        "নমস্কার! I'm excited to help you learn Bengali. Let's start with basic greetings. 'নমস্কার' (Nomoshkar) means 'Hello' in Bengali.",
      created_at: new Date(Date.now() - 86300000),
    },
    {
      id: "msg-3",
      chat_id: "chat-2",
      role: "user",
      content: "Can you analyze this image for me?",
      imageUrl: "/placeholder.svg?height=200&width=300&text=Test+Image",
      created_at: new Date(Date.now() - 43200000),
    },
    {
      id: "msg-4",
      chat_id: "chat-2",
      role: "assistant",
      content:
        "I can see this is a test image. In a real scenario with an actual image, I would analyze its contents and provide educational information about what I see.",
      created_at: new Date(Date.now() - 43100000),
    },
  ]

  testMessages.forEach((message) => {
    if (!mockMessages.has(message.chat_id)) {
      mockMessages.set(message.chat_id, [])
    }
    mockMessages.get(message.chat_id).push(message)
  })
}

// Initialize test data
initializeTestData()

export const mockDb = {
  async createUser(name: string, email: string, password: string) {
    console.log("Mock: Creating user", { name, email })
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      language: "en",
      theme: "light",
      created_at: new Date(),
      updated_at: new Date(),
    }

    mockUsers.set(user.email, user)
    mockUsers.set(user.id, user)

    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  async getUserByEmail(email: string) {
    console.log("Mock: Getting user by email", email)
    const user = mockUsers.get(email.toLowerCase())
    if (user) {
      const { password_hash, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },

  async getUserById(id: string) {
    console.log("Mock: Getting user by ID", id)
    const user = mockUsers.get(id)
    if (user) {
      const { password_hash, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },

  async verifyPassword(email: string, password: string) {
    console.log("Mock: Verifying password for", email)
    const user = mockUsers.get(email.toLowerCase())

    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) return null

    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  async updateUser(userId: string, updates: any) {
    console.log("Mock: Updating user", { userId, updates })
    const user = mockUsers.get(userId)
    if (user) {
      const updatedUser = { ...user, ...updates, updated_at: new Date() }
      mockUsers.set(userId, updatedUser)
      mockUsers.set(user.email, updatedUser)

      const { password_hash, ...userWithoutPassword } = updatedUser
      return userWithoutPassword
    }
    return null
  },

  async updateLastLogin(userId: string) {
    console.log("Mock: Updating last login for", userId)
    const user = mockUsers.get(userId)
    if (user) {
      user.last_login = new Date()
      mockUsers.set(userId, user)
      mockUsers.set(user.email, user)
    }
  },

  async createSession(userId: string) {
    console.log("Mock: Creating session for user", userId)
    const token = uuidv4()
    const session = {
      id: uuidv4(),
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
    }

    mockSessions.set(token, session)
    return token
  },

  async getSession(token: string) {
    console.log("Mock: Getting session", token)
    const session = mockSessions.get(token)
    if (session && session.expires_at > new Date()) {
      return session
    }
    return null
  },

  async deleteSession(token: string) {
    console.log("Mock: Deleting session", token)
    mockSessions.delete(token)
  },

  async deleteExpiredSessions() {
    console.log("Mock: Cleaning expired sessions")
    const now = new Date()
    for (const [token, session] of mockSessions.entries()) {
      if (session.expires_at <= now) {
        mockSessions.delete(token)
      }
    }
  },

  async createChat(userId: string, title: string) {
    console.log("Mock: Creating chat", { userId, title })
    const chat = {
      id: uuidv4(),
      user_id: userId,
      title,
      created_at: new Date(),
      updated_at: new Date(),
    }

    mockChats.set(chat.id, chat)
    mockMessages.set(chat.id, [])
    return chat
  },

  async getChatsByUserId(userId: string) {
    console.log("Mock: Getting chats for user", userId)
    const userChats = []
    for (const chat of mockChats.values()) {
      if (chat.user_id === userId) {
        userChats.push(chat)
      }
    }
    return userChats.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  },

  async getChatById(chatId: string) {
    console.log("Mock: Getting chat by ID", chatId)
    return mockChats.get(chatId) || null
  },

  async updateChatTitle(chatId: string, title: string) {
    console.log("Mock: Updating chat title", { chatId, title })
    const chat = mockChats.get(chatId)
    if (chat) {
      chat.title = title
      chat.updated_at = new Date()
      mockChats.set(chatId, chat)
    }
  },

  async deleteChat(chatId: string) {
    console.log("Mock: Deleting chat", chatId)
    mockChats.delete(chatId)
    mockMessages.delete(chatId)
  },

  async createMessage(chatId: string, role: string, content: string, imageUrl?: string) {
    console.log("Mock: Creating message", { chatId, role, content, imageUrl })
    const message = {
      id: uuidv4(),
      chat_id: chatId,
      role,
      content,
      imageUrl,
      created_at: new Date(),
    }

    if (!mockMessages.has(chatId)) {
      mockMessages.set(chatId, [])
    }

    mockMessages.get(chatId).push(message)

    // Update chat timestamp
    const chat = mockChats.get(chatId)
    if (chat) {
      chat.updated_at = new Date()
      mockChats.set(chatId, chat)
    }

    return message
  },

  async getMessagesByChatId(chatId: string) {
    console.log("Mock: Getting messages for chat", chatId)
    return mockMessages.get(chatId) || []
  },

  async getStats() {
    console.log("Mock: Getting admin stats")
    const totalUsers = mockUsers.size / 2 // Divide by 2 because we store by both email and id
    const totalChats = mockChats.size
    const totalMessages = Array.from(mockMessages.values()).reduce((sum, messages) => sum + messages.length, 0)
    const activeUsers = mockSessions.size

    return {
      totalUsers,
      totalChats,
      totalMessages,
      activeUsers,
    }
  },

  async initialize() {
    console.log("Mock: Database initialized with test data")
    return true
  },
}
