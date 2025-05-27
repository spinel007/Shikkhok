"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  AlertTriangle,
  BookOpen,
  Settings,
  Globe,
} from "lucide-react"
import Link from "next/link"

interface DebugInfo {
  status: "success" | "error" | "loading"
  message: string
  details?: any
  error?: string
}

export default function DebugPage() {
  const [openaiTest, setOpenaiTest] = useState<DebugInfo>({ status: "loading", message: "Not tested" })
  const [chatTest, setChatTest] = useState<DebugInfo>({ status: "loading", message: "Not tested" })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    testOpenAI()
  }, [])

  const testOpenAI = async () => {
    setIsLoading(true)
    setOpenaiTest({ status: "loading", message: "Testing..." })

    try {
      const response = await fetch("/api/test-openai")
      const data = await response.json()
      setOpenaiTest(data)
    } catch (error) {
      setOpenaiTest({
        status: "error",
        message: "Failed to test OpenAI connection",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testChat = async () => {
    setIsLoading(true)
    setChatTest({ status: "loading", message: "Testing..." })

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: "Test message from debug page" }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatTest({
          status: "success",
          message: "Chat API is working correctly",
          details: {
            responseLength: data.reply?.length || 0,
            hasReply: !!data.reply,
          },
        })
      } else {
        const errorData = await response.json()
        setChatTest({
          status: "error",
          message: `Chat API failed with status ${response.status}`,
          error: errorData.error || "Unknown error",
        })
      }
    } catch (error) {
      setChatTest({
        status: "error",
        message: "Failed to test chat API",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shikkhok AI Debug Dashboard</h1>
          </div>
          <p className="text-gray-600">Comprehensive system diagnostics and troubleshooting</p>
          <div className="mt-4">
            <Link href="/chat">
              <Button variant="outline">← Back to Chat</Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick System Tests</CardTitle>
            <CardDescription>Test core functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button onClick={testOpenAI} disabled={isLoading} className="flex-1">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Test OpenAI Connection
              </Button>
              <Button onClick={testChat} disabled={isLoading} className="flex-1">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Test Chat API
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Alert variant={openaiTest.status === "error" ? "destructive" : "default"}>
                {openaiTest.status === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : openaiTest.status === "error" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">OpenAI: {openaiTest.message}</p>
                    {openaiTest.details && (
                      <div className="space-y-1">
                        {Object.entries(openaiTest.details).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                            <Badge variant={value === true ? "default" : value === false ? "destructive" : "secondary"}>
                              {String(value)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    {openaiTest.error && (
                      <p className="text-sm text-red-600 mt-2">
                        <strong>Error:</strong> {openaiTest.error}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              <Alert variant={chatTest.status === "error" ? "destructive" : "default"}>
                {chatTest.status === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : chatTest.status === "error" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Chat API: {chatTest.message}</p>
                    {chatTest.details && (
                      <div className="space-y-1">
                        {Object.entries(chatTest.details).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                            <Badge variant={value === true ? "default" : value === false ? "destructive" : "secondary"}>
                              {String(value)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    {chatTest.error && (
                      <p className="text-sm text-red-600 mt-2">
                        <strong>Error:</strong> {chatTest.error}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Troubleshooting Guide
            </CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Environment Variables Setup
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">
                  Make sure these environment variables are set in your Vercel project:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-2 rounded border">
                    <code className="text-sm">OPENAI_API_KEY</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard("OPENAI_API_KEY")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded border">
                    <code className="text-sm">ASSISTANT_ID</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard("ASSISTANT_ID")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Common Issues & Solutions</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-red-700">❌ Environment variables not found</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                    <li>• Add OPENAI_API_KEY and ASSISTANT_ID</li>
                    <li>• **Important:** Redeploy your app after adding variables</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-orange-700">⚠️ Invalid API key format</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• API key should start with sk-proj- or sk-</li>
                    <li>• Remove any extra spaces or characters</li>
                    <li>• Generate a new API key if needed</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-blue-700">ℹ️ Assistant not found</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Create an Assistant at OpenAI Platform</li>
                    <li>• Copy the Assistant ID (starts with asst_)</li>
                    <li>• Make sure it exists in your OpenAI account</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Useful Links
            </CardTitle>
            <CardDescription>External resources and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">OpenAI Platform</h4>
                <div className="space-y-2">
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    API Keys
                  </a>
                  <a
                    href="https://platform.openai.com/assistants"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Assistants
                  </a>
                  <a
                    href="https://platform.openai.com/usage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Usage Dashboard
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Vercel Platform</h4>
                <div className="space-y-2">
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Dashboard
                  </a>
                  <a
                    href="https://vercel.com/docs/concepts/projects/environment-variables"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Environment Variables Guide
                  </a>
                  <a
                    href="https://vercel.com/docs/concepts/functions/serverless-functions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Functions Documentation
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
