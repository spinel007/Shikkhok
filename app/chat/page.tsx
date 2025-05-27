"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Send,
  Plus,
  MessageSquare,
  BookOpen,
  Menu,
  Bot,
  LogOut,
  Settings,
  AlertCircle,
  Loader2,
  ImageIcon,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { DebugPanel } from "./debug-panel"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isLoading?: boolean
  imageUrl?: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentChatId, setCurrentChatId] = useState("1")
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Learning Bengali Grammar",
      messages: [
        {
          id: "1",
          content:
            "আসসালামু আলাইকুম! আমি শিক্ষক, আপনার বাংলা ভাষা শেখার সহায়ক। আজ আপনি কী শিখতে চান? আপনি টেক্সট বা ছবি পাঠিয়ে প্রশ্ন করতে পারেন।\n\n🔊 ভয়েস: আসসালামু আলাইকুম, আমি শিক্ষক, আপনার বাংলা টিউটর।",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    },
  ])

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats])

  // Re-render MathJax when messages change
  useEffect(() => {
    if (typeof window !== "undefined" && window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [chats])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default") // You'll need to set this up in Cloudinary

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/demo/image/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Image upload failed:", error)
      // Fallback: convert to base64
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    }
  }

  const askAI = async (userMessage: string, imageUrl?: string) => {
    setIsLoading(true)
    setError("")

    try {
      console.log("Sending request to /api/ask...")
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage, imageUrl }),
      })

      console.log("Response status:", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP ${res.status}: ${errorText}`)
      }

      const data = await res.json()
      console.log("API Response received:", { hasReply: !!data.reply, hasError: !!data.error })

      if (data.error) {
        throw new Error(data.error)
      }

      return data.reply
    } catch (error) {
      console.error("AI API Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to get AI response"
      setError(`API Error: ${errorMessage}`)

      // Return fallback response
      return getBanglaAIResponse(userMessage, !!imageUrl)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return

    const userMessage = inputMessage.trim() || "ছবি দেখুন এবং ব্যাখ্যা করুন"
    let imageUrl: string | undefined

    // Upload image if selected
    if (selectedImage) {
      try {
        imageUrl = await uploadImageToCloudinary(selectedImage)
      } catch (error) {
        setError("Failed to upload image")
        return
      }
    }

    setInputMessage("")
    removeImage()

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: "user",
      timestamp: new Date(),
      imageUrl,
    }

    // Add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newUserMessage] } : chat,
      ),
    )

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thinking...",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, loadingMessage] } : chat,
      ),
    )

    // Get AI response
    const aiResponse = await askAI(userMessage, imageUrl)

    // Replace loading message with actual response
    const finalMessage: Message = {
      id: loadingMessage.id,
      content: aiResponse,
      role: "assistant",
      timestamp: new Date(),
      isLoading: false,
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) => (msg.id === loadingMessage.id ? finalMessage : msg)),
            }
          : chat,
      ),
    )

    // Update chat title if it's the first user message
    if (currentChat && currentChat.messages.length === 2) {
      const title = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage
      setChats((prev) => prev.map((chat) => (chat.id === currentChatId ? { ...chat, title } : chat)))
    }
  }

  const getBanglaAIResponse = (userMessage: string, hasImage = false): string => {
    if (hasImage) {
      return `**ছবি বিশ্লেষণ:** আপনার পাঠানো ছবিটি দেখে মনে হচ্ছে এটি বাংলা ভাষার একটি গুরুত্বপূর্ণ বিষয়।

**ব্যাখ্যা:** ছবিতে যা দেখানো হয়েছে তা বুঝতে হলে প্রসঙ্গ জানা দরকার।

**পরামর্শ:**
• ছবির সাথে একটি নির্দিষ্ট প্রশ্ন করুন
• কোন বিষয়ে সাহায্য চান তা বলুন
• আরো বিস্তারিত তথ্য দিন

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: ছবি সহ প্রশ্ন করলে আরো ভালো সাহায্য করতে পারব।`
    }

    // Fallback responses when OpenAI is not available
    const responses = [
      `**ব্যাখ্যা:** এটি একটি গুরুত্বপূর্ণ বিষয়। বাংলায় এই নিয়মটি বুঝতে হলে প্রথমে মূল ধারণাটি জানতে হবে।

**উদাহরণ:** যেমন "আমি বই পড়ি" (Ami boi pori) বাক্যে "আমি" (Ami) কর্তা, "বই" (boi) কর্ম এবং "পড়ি" (pori) ক্রিয়া।

**গাণিতিক সূত্র:** $$a^2 + b^2 = c^2$$

**চিত্র:**
কর্তা → ক্রিয়া → কর্ম
আমি → পড়ি → বই

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: বাংলা ব্যাকরণে কর্তা, ক্রিয়া ও কর্মের সম্পর্ক বুঝতে হবে।`,

      `**ব্যাখ্যা:** চমৎকার প্রশ্ন! এই বিষয়টি নবম-দশম শ্রেণির পাঠ্যক্রমে খুবই গুরুত্বপূর্ণ।

**উদাহরণ:** যেমন "সূর্য পূর্ব দিকে ওঠে" (Surjo purbo dike othe) - এখানে সূর্য ওঠার নিয়মটি প্রকৃতির চিরন্তন সত্য।

**গণিত:** বৃত্তের ক্ষেত্রফল = $\\pi r^2$

**বিশেষ টিপস:**
• নিয়মিত অনুশীলন করুন
• উদাহরণ দিয়ে বুঝুন  
• প্রশ্ন করতে দ্বিধা করবেন না

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: নিয়মিত অনুশীলনে বাংলা সহজ হয়ে যাবে।`,

      `**ব্যাখ্যা:** এটি একটি সাধারণ ভুল যা অনেকেই করে থাকেন। চলুন সঠিক নিয়মটি শিখি।

**উদাহরণ:** 
✗ ভুল: "আমি স্কুলে যাবো" (Ami school-e jabo)
✓ সঠিক: "আমি স্কুলে যাব" (Ami school-e jab)

**সমীকরণ:** $x + y = z$ যেখানে $x$ হল কর্তা, $y$ হল ক্রিয়া এবং $z$ হল সম্পূর্ণ বাক্য।

**মনে রাখার কৌশল:**
ভবিষ্যৎ কালে "বো" এর পরিবর্তে "ব" ব্যবহার করুন।

আরো জানতে চাইলে বলুন!

🔊 ভয়েস: ভবিষ্যৎ কালে সঠিক বানান ব্যবহার করা জরুরি।`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [
        {
          id: Date.now().toString(),
          content:
            "আসসালামু আলাইকুম! আমি শিক্ষক, আপনার বাংলা ভাষা শেখার সহায়ক। আজ আপনি কী শিখতে চান? আপনি টেক্সট বা ছবি পাঠিয়ে প্রশ্ন করতে পারেন।\n\n🔊 ভয়েস: আসসালামু আলাইকুম, আমি শিক্ষক, আপনার বাংলা টিউটর।",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-gray-900 text-white overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-8 w-8 text-green-400" />
            <h1 className="text-xl font-bold">শিক্ষক AI</h1>
          </div>

          <Button
            onClick={createNewChat}
            className="w-full mb-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant={currentChatId === chat.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left p-3 h-auto ${
                    currentChatId === chat.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-green-100">
                <AvatarFallback className="text-green-700 font-bold">শি</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">শিক্ষক AI</h2>
                <p className="text-sm text-gray-500">Bengali Language Tutor</p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-8 w-8 bg-blue-100">
                  <AvatarFallback className="text-blue-700 text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
              <div className="px-2 py-1.5 text-xs text-gray-500">{user.email}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-green-100 flex-shrink-0">
                    <AvatarFallback className="text-green-700">
                      {message.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-white border border-gray-200"
                  }`}
                >
                  {/* Image display */}
                  {message.imageUrl && (
                    <div className="mb-3">
                      <Image
                        src={message.imageUrl || "/placeholder.svg"}
                        alt="Uploaded image"
                        width={300}
                        height={200}
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  )}

                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </Card>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0">
                    <AvatarFallback className="text-blue-700 text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={150}
                  height={100}
                  className="rounded-lg border border-gray-300"
                />
                <Button
                  onClick={removeImage}
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              {/* File input */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

              {/* Attachment button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                disabled={isLoading}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>

              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your question or upload an image..."
                className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              শিক্ষক AI বাংলা ভাষা শেখার জন্য ডিজাইন করা হয়েছে। ভুল তথ্য থাকতে পারে। ছবি আপলোড করে প্রশ্ন করতে পারেন।
            </p>
          </div>
        </div>
      </div>

      {/* Debug Panel - only show in development */}
      {process.env.NODE_ENV === "development" && <DebugPanel />}
    </div>
  )
}
