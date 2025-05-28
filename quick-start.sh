#!/bin/bash

echo "🚀 Quick Start for Shikkhok AI Platform"
echo "======================================"

# 1. Install PostgreSQL if not installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# 2. Quick database setup
echo "🗄️ Setting up database..."
sudo -u postgres psql << EOF
CREATE DATABASE shikkhok_ai;
CREATE USER shikkhok_user WITH PASSWORD 'test123';
GRANT ALL PRIVILEGES ON DATABASE shikkhok_ai TO shikkhok_user;
EOF

# 3. Create .env.local
echo "📝 Creating environment file..."
cat > .env.local << EOF
DATABASE_URL=postgresql://shikkhok_user:test123@localhost:5432/shikkhok_ai
SESSION_SECRET=test-secret-key-12345
ADMIN_EMAILS=test@example.com
OPENAI_API_KEY=${OPENAI_API_KEY:-your_openai_key_here}
ASSISTANT_ID=${ASSISTANT_ID:-your_assistant_id_here}
NODE_ENV=development
EOF

# 4. Install dependencies
echo "📦 Installing dependencies..."
npm install --force

# 5. Initialize database
echo "🗄️ Creating database tables..."
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const schema = \`
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(id),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`;

pool.query(schema).then(() => {
    console.log('✅ Database tables created!');
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "⚠️  Don't forget to add your OpenAI API key in .env.local!"
