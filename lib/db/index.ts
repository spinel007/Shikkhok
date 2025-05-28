import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

// Determine database path
const dbPath = process.env.DATABASE_URL?.replace("sqlite:", "") || "./shikkhok.db"

// Ensure directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize SQLite database
const database = new Database(dbPath)

// Enable foreign keys
database.pragma("foreign_keys = ON")

// Types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  avatar_url?: string
  language: string
  theme: string
  created_at: Date
  updated_at: Date
  last_login?: Date
}

export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: Date
  created_at: Date
}

export interface Chat {
  id: string
  user_id: string
  title: string
  created_at: Date
  updated_at: Date
}

export interface Message {
  id: string
  chat_id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: Date
}

// Initialize database schema
function initializeSchema() {
  try {
    // Users table
    database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        bio TEXT,
        avatar_url TEXT,
        language TEXT DEFAULT 'en',
        theme TEXT DEFAULT 'light',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `)

    // Sessions table
    database.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Chats table
    database.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Messages table
    database.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
    `)

    console.log("✅ Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

// Database functions
export const db = {
  // User operations
  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    const stmt = database.prepare(`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `)

    stmt.run(id, name, email.toLowerCase(), hashedPassword)

    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(id) as any
    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
      last_login: user.last_login ? new Date(user.last_login) : undefined,
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = database.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as any
    if (!user) return null

    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
      last_login: user.last_login ? new Date(user.last_login) : undefined,
    }
  },

  async getUserById(id: string): Promise<User | null> {
    const user = database.prepare("SELECT * FROM users WHERE id = ?").get(id) as any
    if (!user) return null

    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
      last_login: user.last_login ? new Date(user.last_login) : undefined,
    }
  },

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = database.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as any
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) return null

    const { password_hash, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      created_at: new Date(userWithoutPassword.created_at),
      updated_at: new Date(userWithoutPassword.updated_at),
      last_login: userWithoutPassword.last_login ? new Date(userWithoutPassword.last_login) : undefined,
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const allowedFields = ["name", "phone", "location", "bio", "avatar_url", "language", "theme"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) return null

    const setClause = updateFields.map((field) => `${field} = ?`).join(", ")
    const values = updateFields.map((field) => updates[field as keyof User])

    const stmt = database.prepare(`
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `)

    stmt.run(...values, userId)

    return this.getUserById(userId)
  },

  async updateLastLogin(userId: string): Promise<void> {
    database.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(userId)
  },

  // Session operations
  async createSession(userId: string): Promise<string> {
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const stmt = database.prepare(`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `)

    stmt.run(userId, token, expiresAt.toISOString())
    return token
  },

  async getSession(token: string): Promise<Session | null> {
    const session = database
      .prepare(`
      SELECT * FROM sessions 
      WHERE token = ? AND expires_at > datetime('now')
    `)
      .get(token) as any

    if (!session) return null

    return {
      ...session,
      expires_at: new Date(session.expires_at),
      created_at: new Date(session.created_at),
    }
  },

  async deleteSession(token: string): Promise<void> {
    database.prepare("DELETE FROM sessions WHERE token = ?").run(token)
  },

  async deleteExpiredSessions(): Promise<void> {
    database.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run()
  },

  // Chat operations
  async createChat(userId: string, title: string): Promise<Chat> {
    const id = uuidv4()
    const stmt = database.prepare(`
      INSERT INTO chats (id, user_id, title)
      VALUES (?, ?, ?)
    `)

    stmt.run(id, userId, title)

    const chat = database.prepare("SELECT * FROM chats WHERE id = ?").get(id) as any
    return {
      ...chat,
      created_at: new Date(chat.created_at),
      updated_at: new Date(chat.updated_at),
    }
  },

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    const chats = database
      .prepare(`
      SELECT * FROM chats 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `)
      .all(userId) as any[]

    return chats.map((chat) => ({
      ...chat,
      created_at: new Date(chat.created_at),
      updated_at: new Date(chat.updated_at),
    }))
  },

  async getChatById(chatId: string): Promise<Chat | null> {
    const chat = database.prepare("SELECT * FROM chats WHERE id = ?").get(chatId) as any
    if (!chat) return null

    return {
      ...chat,
      created_at: new Date(chat.created_at),
      updated_at: new Date(chat.updated_at),
    }
  },

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    database.prepare("UPDATE chats SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(title, chatId)
  },

  async deleteChat(chatId: string): Promise<void> {
    database.prepare("DELETE FROM chats WHERE id = ?").run(chatId)
  },

  // Message operations
  async createMessage(chatId: string, role: "user" | "assistant" | "system", content: string): Promise<Message> {
    const id = uuidv4()
    const stmt = database.prepare(`
      INSERT INTO messages (id, chat_id, role, content)
      VALUES (?, ?, ?, ?)
    `)

    stmt.run(id, chatId, role, content)

    // Update chat's updated_at timestamp
    database.prepare("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(chatId)

    const message = database.prepare("SELECT * FROM messages WHERE id = ?").get(id) as any
    return {
      ...message,
      created_at: new Date(message.created_at),
    }
  },

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const messages = database
      .prepare(`
      SELECT * FROM messages 
      WHERE chat_id = ? 
      ORDER BY created_at ASC
    `)
      .all(chatId) as any[]

    return messages.map((message) => ({
      ...message,
      created_at: new Date(message.created_at),
    }))
  },

  // Admin operations
  async getStats() {
    const totalUsers = database.prepare("SELECT COUNT(*) as count FROM users").get() as any
    const totalChats = database.prepare("SELECT COUNT(*) as count FROM chats").get() as any
    const totalMessages = database.prepare("SELECT COUNT(*) as count FROM messages").get() as any
    const activeUsers = database
      .prepare(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM sessions 
      WHERE expires_at > datetime('now')
    `)
      .get() as any

    return {
      totalUsers: totalUsers.count,
      totalChats: totalChats.count,
      totalMessages: totalMessages.count,
      activeUsers: activeUsers.count,
    }
  },

  // Initialize database
  async initialize() {
    initializeSchema()

    // Create default admin user if it doesn't exist
    const adminEmail = (process.env.ADMIN_EMAILS || "admin@example.com").split(",")[0].trim()
    const existingAdmin = await this.getUserByEmail(adminEmail)

    if (!existingAdmin) {
      console.log(`Creating default admin user: ${adminEmail}`)
      await this.createUser("Admin User", adminEmail, "admin123")
    }
  },
}

// Initialize database on startup
db.initialize().catch(console.error)

// Clean up expired sessions periodically
setInterval(
  () => {
    db.deleteExpiredSessions().catch(console.error)
  },
  60 * 60 * 1000,
) // Every hour
