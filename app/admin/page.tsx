"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MessageSquare,
  Activity,
  TrendingUp,
  Database,
  Server,
  Shield,
  RefreshCw,
  Eye,
  Download,
  BarChart3,
  BookOpen,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface AdminStats {
  users: {
    total: number
    active: number
    newToday: number
    newThisWeek: number
    newThisMonth: number
  }
  chats: {
    total: number
    todayCount: number
    weekCount: number
    monthCount: number
    averagePerUser: number
  }
  messages: {
    total: number
    todayCount: number
    weekCount: number
    monthCount: number
    averagePerChat: number
  }
  sessions: {
    active: number
    totalToday: number
  }
  growth: {
    userGrowthRate: number
    chatGrowthRate: number
    messageGrowthRate: number
  }
}

interface UserData {
  id: string
  name: string
  email: string
  createdAt: string
  lastLogin?: string
  chatCount: number
  messageCount: number
  preferences: {
    language: string
    theme: string
  }
}

interface DashboardData {
  success: boolean
  stats: AdminStats
  recentUsers: UserData[]
  mostActiveUsers: UserData[]
  systemInfo?: {
    totalStorage: string
    uptime: number
    nodeVersion: string
    platform: string
    timestamp: string
  }
}

export default function AdminPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [allUsers, setAllUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Check if current user is admin
  const isUserAdmin = user?.email === "asiful@shikkhok.ai"

  useEffect(() => {
    console.log("AdminPage useEffect - user:", !!user, "authLoading:", authLoading, "isAdmin:", isUserAdmin)

    if (!authLoading) {
      if (!user) {
        console.log("No user, redirecting to login")
        router.push("/login")
        return
      }

      if (!isUserAdmin) {
        console.log("User is not admin:", user.email)
        setError("Access denied. Admin privileges required.")
        setLoading(false)
        return
      }

      console.log("User is admin, loading dashboard data")
      loadDashboardData()
    }
  }, [user, authLoading, isUserAdmin, router])

  const loadDashboardData = async () => {
    try {
      console.log("Loading dashboard data...")
      setLoading(true)
      setError("")

      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Dashboard API response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (response.status === 401) {
        console.log("Unauthorized - redirecting to login")
        router.push("/login")
        return
      }

      if (response.status === 403) {
        console.log("Access denied - not admin")
        setError("Access denied. Admin privileges required.")
        return
      }

      // Get response text first to debug
      const responseText = await response.text()
      console.log("Raw response:", responseText.substring(0, 200))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`)
      }

      // Try to parse JSON
      let data: DashboardData
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Invalid JSON response from server")
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to load dashboard data")
      }

      console.log("Dashboard data loaded successfully:", data)
      setDashboardData(data)
    } catch (error) {
      console.error("Failed to load admin data:", error)
      setError(error instanceof Error ? error.message : "Failed to load admin dashboard")
    } finally {
      setLoading(false)
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin
  if (!authLoading && user && !isUserAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Admin privileges required. Your email ({user.email}) is not authorized for admin access.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Only users with admin email addresses can access this dashboard.</p>
              <p className="text-xs text-gray-500">Authorized admin email: asiful@shikkhok.ai</p>
            </div>
            <div className="mt-4">
              <Link href="/chat">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading while dashboard data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Welcome, {user?.name}!</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-2">
              <Link href="/chat">
                <Button variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
              </Link>
              <Button onClick={loadDashboardData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">No dashboard data available</p>
          <Button onClick={loadDashboardData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const { stats, recentUsers, mostActiveUsers, systemInfo } = dashboardData

  const loadAllUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setAllUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Shikkhok AI Platform Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadDashboardData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="secondary">Admin: {user?.name}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users" onClick={loadAllUsers}>
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.total}</div>
                  <p className="text-xs text-muted-foreground">+{stats.users.newThisWeek} this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.active}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.users.total ? Math.round((stats.users.active / stats.users.total) * 100) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.chats.total}</div>
                  <p className="text-xs text-muted-foreground">{stats.chats.averagePerUser} avg per user</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.messages.total}</div>
                  <p className="text-xs text-muted-foreground">{stats.messages.averagePerChat} avg per chat</p>
                </CardContent>
              </Card>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Growth</CardTitle>
                  <CardDescription>Weekly growth rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">+{stats.growth.userGrowthRate}%</span>
                  </div>
                  <Progress value={Math.min(stats.growth.userGrowthRate, 100)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat Growth</CardTitle>
                  <CardDescription>Weekly growth rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">+{stats.growth.chatGrowthRate}%</span>
                  </div>
                  <Progress value={Math.min(stats.growth.chatGrowthRate, 100)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Message Growth</CardTitle>
                  <CardDescription>Weekly growth rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-600">+{stats.growth.messageGrowthRate}%</span>
                  </div>
                  <Progress value={Math.min(stats.growth.messageGrowthRate, 100)} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10 bg-blue-100">
                          <AvatarFallback className="text-blue-700">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{user.chatCount} chats</p>
                          <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Active Users</CardTitle>
                  <CardDescription>Users with most messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mostActiveUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <span className="text-sm font-bold text-green-700">#{index + 1}</span>
                        </div>
                        <Avatar className="h-10 w-10 bg-blue-100">
                          <AvatarFallback className="text-blue-700">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.messageCount} messages</p>
                        </div>
                        <Badge variant="secondary">{user.chatCount} chats</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete user list with statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.length > 0 ? (
                    allUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 bg-blue-100">
                            <AvatarFallback className="text-blue-700">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge variant="outline">{user.preferences?.language || "mixed"}</Badge>
                              <span className="text-xs text-gray-500">Joined {formatDate(user.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">{user.chatCount}</p>
                              <p className="text-xs text-gray-500">Chats</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">{user.messageCount}</p>
                              <p className="text-xs text-gray-500">Messages</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found. Click to load users.</p>
                      <Button onClick={loadAllUsers} className="mt-4">
                        Load Users
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>Today's platform activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Users Today</span>
                    <Badge variant="secondary">{stats.users.newToday}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chats Created Today</span>
                    <Badge variant="secondary">{stats.chats.todayCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Messages Today</span>
                    <Badge variant="secondary">{stats.messages.todayCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <Badge variant="secondary">{stats.sessions.active}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Trends</CardTitle>
                  <CardDescription>This week's performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Users This Week</span>
                    <Badge variant="secondary">{stats.users.newThisWeek}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chats This Week</span>
                    <Badge variant="secondary">{stats.chats.weekCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Messages This Week</span>
                    <Badge variant="secondary">{stats.messages.weekCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">User Growth Rate</span>
                    <Badge variant="secondary">+{stats.growth.userGrowthRate}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database Type</span>
                    <Badge variant="outline">{systemInfo?.totalStorage || "In-Memory"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Node.js Version</span>
                    <Badge variant="outline">{systemInfo?.nodeVersion || "Unknown"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform</span>
                    <Badge variant="outline">{systemInfo?.platform || "Unknown"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <Badge variant="outline">{formatUptime(systemInfo?.uptime || 0)}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <Badge variant="outline">{stats.users.total + stats.chats.total}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <Badge variant="outline">{stats.sessions.active}</Badge>
                  </div>
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      Currently using in-memory storage. Data will be lost on server restart.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>System management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
