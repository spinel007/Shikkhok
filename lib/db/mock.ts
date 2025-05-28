// Mock database for testing without real database setup
export const mockDb = {
  async createUser(name: string, email: string, password: string) {
    console.log("Mock: Creating user", { name, email })
    return {
      id: "mock-user-id",
      name,
      email,
      created_at: new Date(),
    }
  },

  async getUserByEmail(email: string) {
    console.log("Mock: Getting user by email", email)
    if (email === "test@example.com") {
      return {
        id: "mock-user-id",
        name: "Test User",
        email: "test@example.com",
        password_hash: "$2a$10$mock.hash.for.testing",
        created_at: new Date(),
      }
    }
    return null
  },

  async verifyPassword(email: string, password: string) {
    console.log("Mock: Verifying password for", email)
    // For testing, accept any password for test@example.com
    if (email === "test@example.com") {
      return {
        id: "mock-user-id",
        name: "Test User",
        email: "test@example.com",
      }
    }
    return null
  },

  async createSession(userId: string) {
    console.log("Mock: Creating session for user", userId)
    return {
      token: "mock-session-token",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  },

  async getSession(token: string) {
    console.log("Mock: Getting session", token)
    if (token === "mock-session-token") {
      return {
        id: "mock-session-id",
        user_id: "mock-user-id",
        token: "mock-session-token",
        name: "Test User",
        email: "test@example.com",
      }
    }
    return null
  },

  async createChat(userId: string, title: string) {
    console.log("Mock: Creating chat", { userId, title })
    return {
      id: "mock-chat-id",
      userId,
      title,
      created_at: new Date(),
    }
  },

  async getUserChats(userId: string) {
    console.log("Mock: Getting chats for user", userId)
    return [
      {
        id: "mock-chat-1",
        user_id: userId,
        title: "Test Chat 1",
        created_at: new Date(),
      },
      {
        id: "mock-chat-2",
        user_id: userId,
        title: "Test Chat 2",
        created_at: new Date(),
      },
    ]
  },

  async createMessage(chatId: string, role: string, content: string) {
    console.log("Mock: Creating message", { chatId, role, content })
    return {
      id: "mock-message-id",
      chatId,
      role,
      content,
      created_at: new Date(),
    }
  },

  async getChatMessages(chatId: string) {
    console.log("Mock: Getting messages for chat", chatId)
    return [
      {
        id: "mock-msg-1",
        chat_id: chatId,
        role: "user",
        content: "Hello, this is a test message",
        created_at: new Date(),
      },
      {
        id: "mock-msg-2",
        chat_id: chatId,
        role: "assistant",
        content: "Hello! This is a mock response for testing.",
        created_at: new Date(),
      },
    ]
  },

  async deleteSession(token: string) {
    console.log("Mock: Deleting session", token)
    return true
  },

  async updateUser(userId: string, updates: any) {
    console.log("Mock: Updating user", { userId, updates })
    return {
      id: userId,
      ...updates,
      updated_at: new Date(),
    }
  },
}
