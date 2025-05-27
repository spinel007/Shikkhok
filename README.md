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

## Local Development

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd shikkhok-ai-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
\`\`\`

## Build for Production

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

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

## Troubleshooting

### Common Issues

1. **Build fails with pnpm**: This project now uses npm. Make sure to use `npm install` and `npm run build`

2. **Environment variables not found**: 
   - Check that `.env.local` exists and contains the required variables
   - For production, set environment variables in your hosting platform

3. **OpenAI API errors**:
   - Verify your API key is valid
   - Check that your Assistant ID exists
   - Visit `/debug` page for diagnostic information

4. **Math rendering issues**:
   - MathJax loads automatically
   - Use proper LaTeX syntax: `$inline$` or `$$display$$`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
