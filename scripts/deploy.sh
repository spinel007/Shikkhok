#!/bin/bash

# Deployment script for Shikkhok AI Platform

echo "🚀 Deploying Shikkhok AI Platform..."

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if this is a Vercel deployment
if [ "$VERCEL" = "1" ]; then
    echo "🌐 Deploying to Vercel..."
    # Vercel handles the deployment automatically
else
    echo "📦 Starting production server..."
    npm start
fi
