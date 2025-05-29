"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Brain, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const isTestMode = process.env.NODE_ENV === "development" && process.env.TEST_MODE === "true"

const ChatPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingChats, setLoadingChats] = useState<boolean>(false)
  const [chats, setChats] = useState<any[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const router = useRouter()
  const [currentChat, setCurrentChat] = useState(null)

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB")
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

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
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

  const handleUpload = async () => {
    if (!selectedImage) {
      setError("Please select an image first.")
      return
    }

    try {
      const imageUrl = await uploadImageToCloudinary(selectedImage)
      console.log("Image URL:", imageUrl)
      alert(`Image uploaded successfully! URL: ${imageUrl}`)
      setError("")
    } catch (err) {
      setError(`Upload failed: ${err}`)
    }
  }

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
      if (isTestMode) {
        // In test mode, show a helpful message instead of an error
        setError("Test mode: Chat loading simulated. Create a new chat to start testing!")
      } else {
        setError("Failed to load chats. Please try again.")
      }
    } finally {
      setLoadingChats(false)
    }
  }

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      router.push(`/chat/${data.id}`)
    } catch (error) {
      console.error("Failed to create new chat:", error)
      setError("Failed to create new chat. Please try again.")
    }
  }

  return (
    <div>
      <h1>Chat Page</h1>
      <input type="file" accept="image/*" onChange={handleImageSelect} />
      {imagePreview && (
        <div>
          <h2>Image Preview:</h2>
          <img src={imagePreview || "/placeholder.svg"} alt="Selected Image" style={{ maxWidth: "300px" }} />
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleUpload} disabled={!selectedImage}>
        Upload Image
      </button>
      {!currentChat && chats.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isTestMode ? "Welcome to Shikkhok AI Test Mode!" : "Welcome to Shikkhok AI!"}
          </h3>
          <p className="text-gray-600 mb-6">
            {isTestMode
              ? "Test all features including AI chat, image analysis, and Bengali learning tools."
              : "Start a new conversation to begin learning Bengali."}
          </p>
          {isTestMode && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p>
                <strong>Test Features:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  AI Chat Responses{" "}
                  {process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-test-key"
                    ? "(Real AI)"
                    : "(Mock AI)"}
                </li>
                <li>Image Analysis</li>
                <li>Bengali Language Learning</li>
                <li>Chat History Management</li>
                <li>User Profile Settings</li>
              </ul>
            </div>
          )}
          <Button onClick={createNewChat} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Start New Chat
          </Button>
        </div>
      )}
    </div>
  )
}

export default ChatPage
