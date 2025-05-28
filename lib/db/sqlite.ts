import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Use SQLite for testing
const db = new Database("shikkhok.db")

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
  );
`)

export const sqliteDb = {
  // User functions
  async createUser(name: string, email: string, password: string) {
    const id = uuidv4()
    const passwordHash = await bcrypt.hash(password, 10)

    const stmt = db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)")
    stmt.run(id, name, email, passwordHash)

    return { id, name, email }
  },

  async getUserByEmail(email: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?")
    return stmt.get(email)
  },

  async verifyPassword(email: string, password: string) {
    const user = this.getUserByEmail(email)
    if (!user) return null

    const valid = await bcrypt.compare(password, user.password_hash)
    return valid ? user : null
  },

  // Session functions
  async createSession(userId: string) {
    const id = uuidv4()
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const stmt = db.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)")
    stmt.run(id, userId, token, expiresAt.toISOString())

    return { token, expiresAt }
  },

  async getSession(token: string) {
    const stmt = db.prepare(`
      SELECT s.*, u.* 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `)
    return stmt.get(token)
  },

  // Chat functions
  async createChat(userId: string, title: string) {
    const id = uuidv4()
    const stmt = db.prepare("INSERT INTO chats (id, user_id, title) VALUES (?, ?, ?)")
    stmt.run(id, userId, title)
    return { id, userId, title }
  },

  async getUserChats(userId: string) {
    const stmt = db.prepare("SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC")
    return stmt.all(userId)
  },

  // Message functions
  async createMessage(chatId: string, role: string, content: string) {
    const id = uuidv4()
    const stmt = db.prepare("INSERT INTO messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)")
    stmt.run(id, chatId, role, content)
    return { id, chatId, role, content }
  },

  async getChatMessages(chatId: string) {
    const stmt = db.prepare("SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC")
    return stmt.all(chatId)
  },
}
