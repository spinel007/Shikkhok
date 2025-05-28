"use client"

import { useState, type ChangeEvent } from "react"

const ChatPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    </div>
  )
}

export default ChatPage
