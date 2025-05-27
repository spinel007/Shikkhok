"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Mail, Phone, MapPin, Trophy, BookOpen, Clock, Target, Edit, Camera } from "lucide-react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { useState } from "react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Ahmed Hasan",
    email: "ahmed.hasan@email.com",
    phone: "+8801712345678",
    location: "Dhaka, Bangladesh",
    bio: "A student interested in learning Bengali. I want to improve my language skills with the help of Teacher AI.",
    joinDate: "January 2024",
    grade: "10th Grade",
  })

  const stats = [
    { label: "Total Lessons Completed", value: "12", icon: BookOpen, color: "text-blue-600" },
    { label: "Learning Time", value: "24 hours", icon: Clock, color: "text-green-600" },
    { label: "Badges Earned", value: "8", icon: Trophy, color: "text-yellow-600" },
    { label: "Goals Achieved", value: "68%", icon: Target, color: "text-purple-600" },
  ]

  const achievements = [
    { title: "First Lesson Completed", date: "January 15", icon: "🎯" },
    { title: "7 Days Streak", date: "January 22", icon: "🔥" },
    { title: "Grammar Expert", date: "February 5", icon: "📚" },
    { title: "Fast Learner", date: "February 12", icon: "⚡" },
  ]

  const learningGoals = [
    { goal: "Study 30 minutes daily", progress: 75, target: "30 days" },
    { goal: "Complete Grammar Course", progress: 60, target: "2 months" },
    { goal: "Solve 100 Questions", progress: 45, target: "1 month" },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to a backend
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Your personal information and learning progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 bg-blue-100">
                      <AvatarFallback className="text-blue-700 text-2xl font-bold">AH</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
                    <p className="text-gray-600">{profileData.grade}</p>
                    <Badge variant="secondary" className="mt-1">
                      Joined {profileData.joinDate}
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>Progress on your set goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">{goal.goal}</h4>
                        <Badge variant="outline">{goal.target}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={goal.progress} className="flex-1" />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-green-800">{achievement.title}</p>
                        <p className="text-sm text-green-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">Set New Goal</Button>
                <Button variant="outline" className="w-full">
                  View Progress Report
                </Button>
                <Button variant="outline" className="w-full">
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
