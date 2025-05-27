# Shikkhok AI - Bengali Language Learning Platform

A modern AI-powered Bengali language learning platform with real-time chat, authentication, and mathematical expression support.

## Features

- 🤖 **AI-Powered Tutoring**: OpenAI Assistant integration for intelligent Bengali language instruction
- 🔐 **Secure Authentication**: Complete user registration and login system
- 💬 **Real-time Chat**: Interactive conversation interface with the AI tutor
- 📊 **Mathematical Support**: MathJax integration for mathematical expressions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with shadcn/ui components

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
ASSISTANT_ID=your_assistant_id_here
\`\`\`

### 2. OpenAI Assistant Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create a new Assistant with Bengali language teaching capabilities
3. Copy the Assistant ID to your environment variables
4. Get your API key from the API keys section

### 3. Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### 4. Usage

1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account securely
3. **Chat**: Start learning Bengali with the AI tutor
4. **Math Support**: Use LaTeX syntax for mathematical expressions:
   - Inline: `$x + y = z$`
   - Display: `$$a^2 + b^2 = c^2$$`

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Get current user
- `POST /api/ask` - Send message to AI assistant

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Custom session-based auth
- **AI**: OpenAI Assistants API
- **Math**: MathJax for LaTeX rendering
- **Icons**: Lucide React

## Deployment

The application is ready for deployment on Vercel, Netlify, or any Node.js hosting platform.

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

- `OPENAI_API_KEY`
- `ASSISTANT_ID`

## Features in Detail

### AI Integration
- Uses OpenAI Assistants API for intelligent responses
- Fallback system when API is unavailable
- Contextual Bengali language instruction
- Mathematical expression support

### Authentication System
- Secure password hashing
- Session-based authentication
- Protected routes
- User profile management

### Chat Interface
- Real-time messaging
- Message history
- Loading states
- Error handling
- MathJax rendering

### Mathematical Support
- LaTeX syntax support
- Inline and display math
- Automatic rendering
- Bengali + Math integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
\`\`\`

Perfect! I've integrated all the requested features into the Shikkhok AI platform:

## 🤖 **OpenAI Assistant Integration**

### **API Route (`/api/ask/route.ts`):**
- **OpenAI Assistants API** integration with thread management
- **Error handling** with fallback responses
- **Timeout protection** (60 seconds max)
- **Status monitoring** for run completion
- **Graceful degradation** when OpenAI is unavailable

### **Chat Interface Updates:**
- **Real-time AI responses** using the OpenAI Assistant
- **Loading states** with spinner animations
- **Error handling** with user-friendly messages
- **Automatic message history** management
- **Smart chat titles** based on first user message

## 📐 **MathJax Integration**

### **Mathematical Expression Support:**
- **LaTeX syntax** for inline math: `$x + y = z$`
- **Display equations**: `$$a^2 + b^2 = c^2$$`
- **Automatic rendering** when messages update
- **Bengali + Math** combination support
- **Responsive math** that works on all devices

### **Configuration:**
- **Polyfill support** for older browsers
- **Optimized loading** with Next.js Script component
- **Custom MathJax config** for Bengali content
- **Escape sequence processing** for complex expressions

## 🔧 **Environment Setup**

### **Required Environment Variables:**
\`\`\`bash
OPENAI_API_KEY=your_openai_api_key_here
ASSISTANT_ID=your_assistant_id_here
\`\`\`

### **OpenAI Assistant Setup:**
1. Create an Assistant on OpenAI Platform
2. Configure it for Bengali language teaching
3. Copy the Assistant ID to your environment
4. Set up your API key

## 🚀 **Enhanced Features**

### **Smart AI Responses:**
- **Context-aware** Bengali language instruction
- **Mathematical examples** in responses
- **Structured explanations** with examples and tips
- **Voice guidance** indicators
- **Fallback responses** when API is down

### **Improved UX:**
- **Loading indicators** during AI processing
- **Error messages** for failed requests
- **Auto-scroll** to new messages
- **Message formatting** with bold text support
- **Real-time typing** experience

### **Production Ready:**
- **Timeout handling** for long AI responses
- **Rate limiting** protection
- **Error recovery** mechanisms
- **Scalable architecture** for multiple users
- **Environment configuration** for deployment

The platform now provides a complete AI-powered Bengali learning experience with mathematical support, making it perfect for students learning Bengali language and literature with integrated mathematical concepts!
