"use client"

import { useState, useEffect, useRef } from "react"
import type { ChangeEvent } from "react"
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
  Menu,
  Bot,
  LogOut,
  Settings,
  AlertCircle,
  Loader2,
  ImageIcon,
  X,
  Trash2,
  Brain,
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
import { useLanguage } from "@/hooks/use-language"
import { LanguageSelector } from "@/components/language-selector"
import Image from "next/image"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: string
  imageUrl?: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [loadingChats, setLoadingChats] = useState(true)
  const { user, logout, loading } = useAuth()
  const { language, t } = useLanguage()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Load user chats from database
  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user])

  const loadChats = async () => {
    try {
      setLoadingChats(true)
      const response = await fetch("/api/chat", {
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.log("Not authenticated, redirecting to login")
          router.push("/login")
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setChats(data.chats || [])

      // If no current chat and we have chats, select the first one
      if (!currentChatId && data.chats && data.chats.length > 0) {
        setCurrentChatId(data.chats[0].id)
      }
    } catch (error) {
      console.error("Failed to load chats:", error)
      setError("Failed to load chats. Please try again.")
    } finally {
      setLoadingChats(false)
    }
  }

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  useEffect(() => {
    if (typeof window !== "undefined" && window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [currentChat?.messages])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      setSelectedImage(file)

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
    // First try to use the local upload endpoint
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const data = await response.json()
      return data.url
    } catch (uploadError) {
      console.error("Local upload failed, falling back to base64:", uploadError)

      // Fallback to base64 encoding if the upload fails
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
      // First, add the user message to the chat
      if (currentChatId) {
        await fetch(`/api/chat/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: userMessage,
            role: "user",
            imageUrl,
          }),
        })
      }

      // Then get AI response
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage,
          imageUrl,
          language: language,
          chatId: currentChatId,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return "Please log in to continue."
        }
        const errorText = await res.text()
        throw new Error("HTTP " + res.status + ": " + errorText)
      }

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add AI response to chat
      if (currentChatId) {
        await fetch(`/api/chat/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: data.reply,
            role: "assistant",
          }),
        })
      }

      // Reload the current chat to get updated messages
      if (currentChatId) {
        await loadCurrentChat()
      }

      return data.reply
    } catch (error) {
      console.error("AI API Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to get AI response"
      setError("Error: " + errorMessage)
      return "Sorry, I'm having trouble responding right now. Please try again."
    } finally {
      setIsLoading(false)
    }
  }

  const loadCurrentChat = async () => {
    if (!currentChatId) return

    try {
      const response = await fetch(`/api/chat/${currentChatId}`)
      if (response.ok) {
        const data = await response.json()
        setChats((prev) => prev.map((chat) => (chat.id === currentChatId ? data.chat : chat)))
      }
    } catch (error) {
      console.error("Failed to load current chat:", error)
    }
  }

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return

    // Create new chat if none exists
    if (!currentChatId) {
      await createNewChat()
      return
    }

    const userMessage = inputMessage.trim() || (language === "bn" ? "ছবি দেখুন" : "Please analyze this image")
    let imageUrl: string | undefined

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

    // The API will handle saving messages to database
    await askAI(userMessage, imageUrl)
  }

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: "New Conversation" }),
      })

      if (response.ok) {
        const data = await response.json()
        setChats((prev) => [data.chat, ...prev])
        setCurrentChatId(data.chat.id)

        // If we have a message ready to send, send it after chat creation
        if (inputMessage.trim() || selectedImage) {
          // We need to wait a bit to ensure the chat is created
          setTimeout(() => {
            handleSendMessage()
          }, 500)
        }
      } else if (response.status === 401) {
        // Handle authentication error
        router.push("/login")
        setError("Please log in to continue")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create chat")
      }
    } catch (error) {
      console.error("Failed to create chat:", error)
      setError("Failed to create new chat")
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId))

        // If we deleted the current chat, select another one
        if (currentChatId === chatId) {
          const remainingChats = chats.filter((chat) => chat.id !== chatId)
          setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null)
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
      setError("Failed to delete chat")
    }
  }

  if (loading || loadingChats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      console.log("Clipboard API not available")
      return
    }

    try {
      navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-gray-900 text-white overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold">Shikkhok AI</h1>
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
                <div key={chat.id} className="group relative">
                  <Button
                    variant={currentChatId === chat.id ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left p-3 h-auto pr-10 ${
                      currentChatId === chat.id
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => setCurrentChatId(chat.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(chat.id)
                    }}
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-blue-100">
                <AvatarFallback className="text-blue-700 font-bold">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">{t("aiTutor")}</h2>
                <p className="text-sm text-gray-500">{t("bengaliLanguageTutor")}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />

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
        </div>

        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {!currentChat && chats.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Shikkhok AI!</h3>
                <p className="text-gray-600 mb-6">Start a new conversation to begin learning Bengali.</p>
                <Button onClick={createNewChat} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            )}

            {currentChat?.messages?.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0">
                    <AvatarFallback className="text-blue-700">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-white border border-gray-200"
                  }`}
                >
                  {message.imageUrl && (
                    <div className="mb-3">
                      <Image
                        src={message.imageUrl || "/placeholder.svg"}
                        alt="Uploaded image"
                        width={300}
                        height={200}
                        className="rounded-lg max-w-full h-auto"
                        onError={(e) => {
                          // Fallback to placeholder on error
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                          console.error("Failed to load image:", message.imageUrl)
                        }}
                      />
                    </div>
                  )}

                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">{new Date(message.createdAt).toLocaleTimeString()}</div>
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

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0">
                  <AvatarFallback className="text-blue-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white border border-gray-200 p-4">
                  <div className="text-sm text-gray-600">{t("thinking")}</div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={150}
                  height={100}
                  className="rounded-lg border border-gray-300"
                  onError={(e) => {
                    // Fallback to placeholder on error
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                    console.error("Failed to load preview image")
                  }}
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
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

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
                placeholder={t("chatPlaceholder")}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Shikkhok AI is designed for Bengali language learning. All conversations are saved to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
