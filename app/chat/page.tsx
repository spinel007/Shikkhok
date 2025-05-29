"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Send, Plus, MessageSquare, BookOpen, Menu, User, Bot, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
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

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "বাংলা ব্যাকরণ শেখা",
      messages: [
        {
          id: "1",
          content:
            "আসসালামু আলাইকুম! আমি শিক্ষক, আপনার বাংলা ভাষা শেখার সহায়ক। আজ আপনি কী শিখতে চান?\n\n🔊 ভয়েস: আসসালামু আলাইকুম, আমি শিক্ষক, আপনার বাংলা টিউটর।",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    },
  ])

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    // Add user message
    setChats((prev) =>
      prev.map((chat) => (chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat)),
    )

    // Simulate AI response based on the instructions
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBanglaAIResponse(inputMessage),
        role: "assistant",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) => (chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiResponse] } : chat)),
      )
    }, 1000)

    setInputMessage("")
  }

  const getBanglaAIResponse = (userMessage: string): string => {
    // Simulate responses following the Bangla Tutor instructions
    const responses = [
      `**ব্যাখ্যা:** এটি একটি গুরুত্বপূর্ণ বিষয়। বাংলা ভাষায় এই নিয়মটি বুঝতে হলে প্রথমে মূল ধারণাটি জানা দরকার।

**উদাহরণ:** ধরুন, আপনি যদি "আমি বই পড়ি" বাক্যটি দেখেন - এখানে "আমি" হলো কর্তা, "বই" হলো কর্ম এবং "পড়ি" হলো ক্রিয়া।

**চিত্র:**
কর্তা → ক্রিয়া → কর্ম
 আমি  →  পড়ি  →  বই

আরও জানতে চাইলে আমাকে বলো!

🔊 ভয়েস: বাংলা ব্যাকরণে কর্তা, ক্রিয়া আর কর্মের সম্পর্ক বুঝতে হবে।`,

      `**ব্যাখ্যা:** চমৎকার প্রশ্ন! এই বিষয়টি ৯ম-১০ম শ্রেণীর সিলেবাসে খুবই গুরুত্বপূর্ণ।

**উদাহরণ:** যেমন "সূর্য পূর্ব দিকে ওঠে" - এখানে সূর্যের ওঠার নিয়মটি প্রকৃতির একটি ধ্রুব সত্য।

**বিশেষ টিপস:**
• নিয়মিত অনুশীলন করুন
• উদাহরণ দিয়ে বুঝুন
• প্রশ্ন করতে দ্বিধা করবেন না

আরও জানতে চাইলে আমাকে বলো!

🔊 ভয়েস: নিয়মিত অনুশীলন করলে বাংলা ভাষা সহজ হয়ে যাবে।`,

      `**ব্যাখ্যা:** এটি একটি সাধারণ ভুল যা অনেকেই করে থাকেন। আসুন সঠিক নিয়মটি জেনে নিই।

**উদাহরণ:** 
✗ ভুল: "আমি স্কুলে যাবো"
✓ সঠিক: "আমি স্কুলে যাব"

**মনে রাখার কৌশল:**
ভবিষ্যৎ কালে "বো" নয়, "ব" ব্যবহার করুন।

আরও জানতে চাইলে আমাকে বলো!

🔊 ভয়েস: ভবিষ্যৎ কালে সঠিক বানান ব্যবহার করা জরুরি।`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "নতুন কথোপকথন",
      messages: [
        {
          id: Date.now().toString(),
          content:
            "আসসালামু আলাইকুম! আমি শিক্ষক, আপনার বাংলা ভাষা শেখার সহায়ক। আজ আপনি কী শিখতে চান?\n\n🔊 ভয়েস: আসসালামু আলাইকুম, আমি শিক্ষক, আপনার বাংলা টিউটর।",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
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
            নতুন চ্যাট
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
                <p className="text-sm text-gray-500">বাংলা ভাষার টিউটর</p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-8 w-8 bg-blue-100">
                  <AvatarFallback className="text-blue-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>সেটিংস</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>লগআউট</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                </Card>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0">
                    <AvatarFallback className="text-blue-700">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              শিক্ষক AI বাংলা ভাষা শেখার জন্য ডিজাইন করা হয়েছে। ভুল তথ্য থাকতে পারে।
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
