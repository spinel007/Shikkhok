import { Pool } from "pg"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { mockDb } from "./mock"

// Use mock database if no real database URL is provided or if in test mode
const useMockDb =
  !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("test_db") || process.env.NODE_ENV === "test"

let pool: Pool | null = null

if (!useMockDb) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      // Disable native bindings
      native: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Test the connection
    pool.query("SELECT NOW()", (err, res) => {
      if (err) {
        console.error("Database connection error:", err.message)
      } else {
        console.log("Database connected successfully at:", res.rows[0].now)
      }
    })
  } catch (error) {
    console.warn("Database connection failed, using mock database")
  }
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start

    if (process.env.NODE_ENV !== "production") {
      console.log("Executed query", { text, duration, rows: res.rowCount })
    }

    return res
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to get a client from the pool
export async function getClient() {
  const client = await pool.connect()
  const originalRelease = client.release

  // Override the release method
  client.release = () => {
    client.release = originalRelease
    return originalRelease.apply(client)
  }

  return client
}

// Helper function to generate a UUID
export function generateId() {
  return uuidv4()
}

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

// Database functions
export const db = useMockDb
  ? mockDb
  : {
      // Real database functions would go here
      // For now, fallback to mock if real DB fails
      ...mockDb,
      // User operations
      async createUser(name: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10)

        const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, phone, location, bio, avatar_url, language, theme, created_at, updated_at, last_login
    `

        const result = await pool.query(query, [name, email.toLowerCase(), hashedPassword])
        return result.rows[0]
      },

      async getUserByEmail(email: string): Promise<User | null> {
        const query = `
      SELECT id, name, email, phone, location, bio, avatar_url, language, theme, created_at, updated_at, last_login
      FROM users
      WHERE email = $1
    `

        const result = await pool.query(query, [email.toLowerCase()])
        return result.rows[0] || null
      },

      async getUserById(id: string): Promise<User | null> {
        const query = `
      SELECT id, name, email, phone, location, bio, avatar_url, language, theme, created_at, updated_at, last_login
      FROM users
      WHERE id = $1
    `

        const result = await pool.query(query, [id])
        return result.rows[0] || null
      },

      async verifyPassword(email: string, password: string): Promise<User | null> {
        const query = `
      SELECT id, name, email, password_hash, phone, location, bio, avatar_url, language, theme, created_at, updated_at, last_login
      FROM users
      WHERE email = $1
    `

        const result = await pool.query(query, [email.toLowerCase()])
        const user = result.rows[0]

        if (!user) return null

        const isValid = await bcrypt.compare(password, user.password_hash)
        if (!isValid) return null

        // Remove password_hash from the returned user object
        const { password_hash, ...userWithoutPassword } = user
        return userWithoutPassword
      },

      async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
        const allowedFields = ["name", "phone", "location", "bio", "avatar_url", "language", "theme"]
        const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

        if (updateFields.length === 0) return null

        const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
        const values = [userId, ...updateFields.map((field) => updates[field as keyof User])]

        const query = `
      UPDATE users
      SET ${setClause}
      WHERE id = $1
      RETURNING id, name, email, phone, location, bio, avatar_url, language, theme, created_at, updated_at, last_login
    `

        const result = await pool.query(query, values)
        return result.rows[0] || null
      },

      async updateLastLogin(userId: string): Promise<void> {
        await pool.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1", [userId])
      },

      // Session operations
      async createSession(userId: string): Promise<string> {
        const token = uuidv4()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        const query = `
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING token
    `

        await pool.query(query, [userId, token, expiresAt])
        return token
      },

      async getSession(token: string): Promise<Session | null> {
        const query = `
      SELECT id, user_id, token, expires_at, created_at
      FROM sessions
      WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP
    `

        const result = await pool.query(query, [token])
        return result.rows[0] || null
      },

      async deleteSession(token: string): Promise<void> {
        await pool.query("DELETE FROM sessions WHERE token = $1", [token])
      },

      async deleteExpiredSessions(): Promise<void> {
        await pool.query("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP")
      },

      // Chat operations
      async createChat(userId: string, title: string): Promise<Chat> {
        const query = `
      INSERT INTO chats (user_id, title)
      VALUES ($1, $2)
      RETURNING id, user_id, title, created_at, updated_at
    `

        const result = await pool.query(query, [userId, title])
        return result.rows[0]
      },

      async getChatsByUserId(userId: string): Promise<Chat[]> {
        const query = `
      SELECT id, user_id, title, created_at, updated_at
      FROM chats
      WHERE user_id = $1
      ORDER BY updated_at DESC
    `

        const result = await pool.query(query, [userId])
        return result.rows
      },

      async getChatById(chatId: string): Promise<Chat | null> {
        const query = `
      SELECT id, user_id, title, created_at, updated_at
      FROM chats
      WHERE id = $1
    `

        const result = await pool.query(query, [chatId])
        return result.rows[0] || null
      },

      async updateChatTitle(chatId: string, title: string): Promise<void> {
        await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [title, chatId])
      },

      async deleteChat(chatId: string): Promise<void> {
        await pool.query("DELETE FROM chats WHERE id = $1", [chatId])
      },

      // Message operations
      async createMessage(chatId: string, role: "user" | "assistant" | "system", content: string): Promise<Message> {
        const query = `
      INSERT INTO messages (chat_id, role, content)
      VALUES ($1, $2, $3)
      RETURNING id, chat_id, role, content, created_at
    `

        const result = await pool.query(query, [chatId, role, content])

        // Update chat's updated_at timestamp
        await pool.query("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1", [chatId])

        return result.rows[0]
      },

      async getMessagesByChatId(chatId: string): Promise<Message[]> {
        const query = `
      SELECT id, chat_id, role, content, created_at
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC
    `

        const result = await pool.query(query, [chatId])
        return result.rows
      },

      // Admin operations
      async getStats() {
        const queries = {
          totalUsers: "SELECT COUNT(*) as count FROM users",
          totalChats: "SELECT COUNT(*) as count FROM chats",
          totalMessages: "SELECT COUNT(*) as count FROM messages",
          activeUsers: `
        SELECT COUNT(DISTINCT user_id) as count 
        FROM sessions 
        WHERE expires_at > CURRENT_TIMESTAMP
      `,
        }

        const results = await Promise.all(
          Object.entries(queries).map(async ([key, query]) => {
            const result = await pool.query(query)
            return { [key]: Number.parseInt(result.rows[0].count) }
          }),
        )

        return Object.assign({}, ...results)
      },

      // Initialize database tables
      async initialize() {
        try {
          const schemaSQL = `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          location VARCHAR(255),
          bio TEXT,
          avatar_url VARCHAR(500),
          language VARCHAR(10) DEFAULT 'en',
          theme VARCHAR(10) DEFAULT 'light',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP WITH TIME ZONE
        );

        -- Sessions table
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Chats table
        CREATE TABLE IF NOT EXISTS chats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Messages table
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
          role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes if they don't exist
        CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
        CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
      `

          await pool.query(schemaSQL)
          console.log("Database initialized successfully")
        } catch (error) {
          console.error("Database initialization error:", error)
          throw error
        }
      },
    }

export async function initializeDatabase() {
  if (useMockDb) {
    console.log("🧪 Using mock database for testing")
    return
  }

  // Real database initialization would go here
  try {
    await db.initialize()
    console.log("🗄️ Database initialized")
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

// Initialize database on startup
initializeDatabase().catch(console.error)

// Clean up expired sessions periodically
setInterval(
  () => {
    db.deleteExpiredSessions().catch(console.error)
  },
  60 * 60 * 1000,
) // Every hour

export default {
  query,
  getClient,
  generateId,
  pool,
}
