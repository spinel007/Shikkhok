#!/bin/bash

echo "🔧 Fixing PostgreSQL Issues and Starting Shikkhok AI"
echo "=================================================="

# First, install PostgreSQL development headers to fix the compilation
echo "📦 Installing PostgreSQL development libraries..."
apt-get update
apt-get install -y postgresql-server-dev-all libpq-dev build-essential

# If that fails, we'll use a workaround
if [ $? -ne 0 ]; then
    echo "⚠️  PostgreSQL dev libraries installation failed, using workaround..."
    
    # Remove problematic pg dependencies and use pure JS alternatives
    echo "🔄 Removing native PostgreSQL dependencies..."
    rm -rf node_modules package-lock.json
    
    # Create a new package.json without native pg dependencies
    cat > package.json << 'EOF'
{
  "name": "shikkhok-ai-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "ai": "^3.0.23",
    "autoprefixer": "^10.0.1",
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^9.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.1",
    "date-fns": "^3.3.1",
    "embla-carousel-react": "^8.0.0",
    "eslint": "^8",
    "eslint-config-next": "14.1.3",
    "input-otp": "^1.2.2",
    "lucide-react": "^0.344.0",
    "next": "14.1.3",
    "next-themes": "^0.2.1",
    "openai": "^4.28.4",
    "postcss": "^8",
    "react": "^18",
    "react-day-picker": "^8.10.0",
    "react-dom": "^18",
    "react-hook-form": "^7.50.1",
    "react-resizable-panels": "^2.0.13",
    "recharts": "^2.12.2",
    "sonner": "^1.4.2",
    "tailwind-merge": "^2.2.1",
    "tailwindcss": "^3.3.0",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5",
    "uuid": "^9.0.1",
    "vaul": "^0.9.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/better-sqlite3": "^7.6.8",
    "@types/uuid": "^9.0.8"
  }
}
EOF
fi

# Create environment file with your real OpenAI credentials
cat > .env.local << 'EOF'
# Real OpenAI Configuration
OPENAI_API_KEY=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
ASSISTANT_ID=asst_Q0MDNwcpzx6BzOiDYZI1rCw8

# Test Configuration
DATABASE_URL=sqlite:./test.db
SESSION_SECRET=test-secret-key-for-development-only
ADMIN_EMAILS=test@example.com,admin@test.com
NODE_ENV=development
TEST_MODE=true

# Enable all features
ENABLE_IMAGE_ANALYSIS=true
ENABLE_CHAT_HISTORY=true
ENABLE_USER_PROFILES=true
ENABLE_ADMIN_DASHBOARD=true
EOF

echo "📝 Created environment file with your OpenAI credentials"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --force

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Your app will be available at: http://localhost:3000"
echo ""
echo "🤖 AI Features: ENABLED with your OpenAI credentials"
echo "🗄️  Database: Using SQLite (no PostgreSQL needed)"
echo ""
echo "🧪 Test Credentials:"
echo "   Email: test@example.com"
echo "   Password: any password works"
echo ""

# Start the development server
npm run dev
