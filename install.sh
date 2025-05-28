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

# Clean up previous installations
echo "🧹 Cleaning up previous installations..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with legacy peer deps to avoid issues
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  Creating .env.local from example..."
        cp .env.example .env.local
        echo "📝 Please edit .env.local with your credentials"
    else
        echo "⚠️  Creating basic .env.local file..."
        cat > .env.local << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shikkhok_ai

# Session Configuration
SESSION_SECRET=$(openssl rand -hex 32)

# Admin Configuration
ADMIN_EMAILS=admin@example.com

# OpenAI Configuration
# OPENAI_API_KEY=your_openai_api_key_here
# ASSISTANT_ID=your_assistant_id_here

# Node Environment
NODE_ENV=development
EOF
        echo "📝 Please edit .env.local with your credentials"
    fi
fi

echo "✅ Installation complete!"
echo ""
echo "To start the development server:"
echo "npm run dev"
