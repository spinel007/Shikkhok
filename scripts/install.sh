#!/bin/bash

# Installation script for Shikkhok AI Platform

echo "🚀 Setting up Shikkhok AI Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL development libraries are installed
if ! dpkg -l | grep -q postgresql-server-dev; then
    echo "⚠️ PostgreSQL development libraries not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y postgresql-server-dev-all build-essential
    echo "✅ PostgreSQL development libraries installed"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️ Creating .env.local from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ .env.local created from .env.example"
    else
        # Create a basic .env.local if .env.example doesn't exist
        cat > .env.local << EOF
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Assistant ID
ASSISTANT_ID=your_assistant_id_here

# Database URL (PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/shikkhok_ai

# Node Environment
NODE_ENV=development

# Session Secret
SESSION_SECRET=$(openssl rand -hex 32)

# Admin emails
ADMIN_EMAILS=admin@shikkhok-ai.com
EOF
        echo "✅ Basic .env.local created (no .env.example found)"
    fi
    echo "📝 Please edit .env.local with your OpenAI credentials"
fi

# Verify Next.js is installed
if ! grep -q "\"next\":" package.json; then
    echo "⚠️ Next.js not found in package.json. Adding Next.js..."
    npm install next@latest react@latest react-dom@latest
    echo "✅ Next.js installed"
fi

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your OpenAI API key and Assistant ID"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
