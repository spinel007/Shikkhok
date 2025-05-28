#!/bin/bash

echo "🚀 Shikkhok AI Platform - Setup"
echo "==============================="

# Check if running as root
if [ "$(id -u)" -eq 0 ]; then
  echo "⚠️  Running as root. This is not recommended."
  echo "   Consider running without sudo."
  echo ""
fi

# Create .env.local file
echo "📝 Creating environment configuration..."

# Check if .env.local already exists
if [ -f .env.local ]; then
  echo "⚠️  .env.local already exists. Creating .env.local.new instead."
  ENV_FILE=".env.local.new"
else
  ENV_FILE=".env.local"
fi

# Prompt for OpenAI API key
read -p "Enter your OpenAI API key: " OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  No API key provided. You'll need to add it manually to $ENV_FILE later."
  OPENAI_API_KEY="your-openai-api-key"
fi

# Prompt for Assistant ID
read -p "Enter your OpenAI Assistant ID: " ASSISTANT_ID
if [ -z "$ASSISTANT_ID" ]; then
  echo "⚠️  No Assistant ID provided. You'll need to add it manually to $ENV_FILE later."
  ASSISTANT_ID="your-assistant-id"
fi

# Create .env.local file
cat > $ENV_FILE << EOF
# Database Configuration - Using SQLite by default
DATABASE_URL=sqlite:./shikkhok.db

# Session Configuration
SESSION_SECRET=$(openssl rand -hex 32)

# Admin Configuration
ADMIN_EMAILS=admin@example.com

# OpenAI Configuration
OPENAI_API_KEY=$OPENAI_API_KEY
ASSISTANT_ID=$ASSISTANT_ID

# Node Environment
NODE_ENV=development
EOF

echo "✅ Environment file created: $ENV_FILE"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "   Then open http://localhost:3000 in your browser"
echo ""
