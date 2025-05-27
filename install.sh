#!/bin/bash

echo "🧹 Cleaning up previous installations..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "✅ Installation complete!"
echo ""
echo "To start the development server:"
echo "npm run dev"
