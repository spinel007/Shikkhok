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

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local from example..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your OpenAI credentials"
fi

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your OpenAI API key and Assistant ID"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
