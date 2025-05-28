#!/bin/bash

echo "🚀 Starting Shikkhok AI Platform..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy .env.local.example to .env.local and configure it."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Build the application if .next doesn't exist
if [ ! -d ".next" ]; then
    echo "🔨 Building application..."
    npm run build
fi

# Start the application
echo "✅ Starting application on port 3000..."
npm start
