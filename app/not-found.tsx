"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-6 rounded-full">
              <BookOpen className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Oops! The page you're looking for seems to have wandered off on its own learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Don't worry! Even the best students sometimes take a wrong turn. Let's get you back on track with your
            Bengali learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Help
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link href="/chat" className="text-green-600 hover:text-green-700">
                AI Chat Tutor
              </Link>
              <Link href="/lessons" className="text-green-600 hover:text-green-700">
                Bengali Lessons
              </Link>
              <Link href="/practice" className="text-green-600 hover:text-green-700">
                Practice Tests
              </Link>
              <Link href="/about" className="text-green-600 hover:text-green-700">
                About Us
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
