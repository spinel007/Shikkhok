"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface DebugInfo {
  status: "success" | "error"
  message: string
  details?: any
  error?: string
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testOpenAI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-openai")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({
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
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: "Test message" }),
      })

      if (response.ok) {
        const data = await response.json()
        setDebugInfo({
          status: "success",
          message: "Chat API is working",
          details: { responseLength: data.reply?.length || 0 },
        })
      } else {
        const errorData = await response.json()
        setDebugInfo({
          status: "error",
          message: `Chat API failed with status ${response.status}`,
          error: errorData.error || "Unknown error",
        })
      }
    } catch (error) {
      setDebugInfo({
        status: "error",
        message: "Failed to test chat API",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="fixed bottom-4 right-4 z-50">
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Debug Panel</CardTitle>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
            ×
          </Button>
        </div>
        <CardDescription>Test system components</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testOpenAI} disabled={isLoading} size="sm" className="flex-1">
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
            Test OpenAI
          </Button>
          <Button onClick={testChat} disabled={isLoading} size="sm" className="flex-1">
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
            Test Chat
          </Button>
        </div>

        {debugInfo && (
          <Alert variant={debugInfo.status === "error" ? "destructive" : "default"}>
            {debugInfo.status === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{debugInfo.message}</p>

                {debugInfo.details && (
                  <div className="space-y-1">
                    {Object.entries(debugInfo.details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                        <Badge variant={value === true ? "default" : value === false ? "destructive" : "secondary"}>
                          {String(value)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {debugInfo.error && (
                  <p className="text-sm text-red-600 mt-2">
                    <strong>Error:</strong> {debugInfo.error}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
