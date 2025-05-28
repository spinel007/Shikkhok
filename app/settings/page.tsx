"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, ArrowLeft, MessageSquare, Camera, Save, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    setIsSaved(false)

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      const data = await response.json()

      setIsSaved(true)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })

      // Reset the saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Chat</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-green-600" />
                <span className="text-lg font-bold text-gray-900">শিক্ষক AI</span>
              </div>
            </div>

            <Link href="/chat">
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Go to Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 bg-blue-100">
                  <AvatarFallback className="text-blue-700 text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Profile Picture</h3>
                <p className="text-sm text-gray-600 mb-3">Upload a new profile picture</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profileData.email} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+880 1712-345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="Dhaka, Bangladesh"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isLoading}
                className={`mt-6 ${isSaved ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : isSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved Successfully
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and membership information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">User ID</span>
                <span className="text-sm text-gray-600 font-mono">{user.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Account Type</span>
                <span className="text-sm text-gray-600">Free</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
