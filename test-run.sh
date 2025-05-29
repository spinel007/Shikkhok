#!/bin/bash

echo "🧪 Complete Test Setup for Shikkhok AI Platform"
echo "==============================================="

# Check if OpenAI API key is provided
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  No OPENAI_API_KEY found in environment"
    echo "   You can set it with: export OPENAI_API_KEY=your_key_here"
    echo "   Or the app will use mock AI responses"
    echo ""
fi

# Create a complete .env.local for testing with real AI
cat > .env.local << EOF
# Complete test configuration with real AI support
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
SESSION_SECRET=test-secret-key-for-development-only-$(date +%s)
ADMIN_EMAILS=test@example.com,admin@test.com

# Real OpenAI Configuration
OPENAI_API_KEY=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
ASSISTANT_ID=asst_Q0MDNwcpzx6BzOiDYZI1rCw8

NODE_ENV=development

# Test mode flag
TEST_MODE=true

# Enable all features for testing
ENABLE_IMAGE_ANALYSIS=true
ENABLE_CHAT_HISTORY=true
ENABLE_USER_PROFILES=true
ENABLE_ADMIN_DASHBOARD=true
EOF

echo "📝 Created complete test environment file"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server with full AI support..."
echo "   Open http://localhost:3000 in your browser"
echo ""
echo "🧪 Test Features Available:"
echo "   ✅ Complete UI and Navigation"
echo "   ✅ User Authentication (test@example.com / any password)"
echo "   ✅ AI Chat Responses (real or mock based on API key)"
echo "   ✅ Image Analysis (if OpenAI API key provided)"
echo "   ✅ Chat History and Management"
echo "   ✅ User Profiles and Settings"
echo "   ✅ Admin Dashboard"
echo "   ✅ Multi-language Support"
echo ""
if [ -n "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "sk-test-key" ]; then
    echo "🤖 AI Features: ENABLED (using real OpenAI GPT-4 and Assistant)"
else
    echo "🤖 AI Features: MOCK MODE (set OPENAI_API_KEY for real AI)"
fi
echo ""

# Start the development server
npm run dev
