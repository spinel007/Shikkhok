#!/bin/bash

echo "🧪 Quick Test Setup for Shikkhok AI Platform"
echo "============================================="

# Create a simple .env.local for testing
cat > .env.local << EOF
# Simple test configuration
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
SESSION_SECRET=test-secret-key-for-development-only
ADMIN_EMAILS=test@example.com
OPENAI_API_KEY=${OPENAI_API_KEY:-sk-test-key}
ASSISTANT_ID=${ASSISTANT_ID:-asst-test-id}
NODE_ENV=development
EOF

echo "📝 Created test environment file"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Open http://localhost:3000 in your browser"
echo ""
echo "⚠️  Note: This is for testing only!"
echo "   - Uses mock database (will show errors but UI will work)"
echo "   - Add real OPENAI_API_KEY for AI features"
echo ""

# Start the development server
npm run dev
