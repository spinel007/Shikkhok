"use client"

import { Button } from "@/components/ui/button"
import { Brain, Menu, X, MessageSquare, HelpCircle, Info } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Shikkhok</span>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/chat">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Go to Chat
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <Info className="h-4 w-4 inline mr-2" />
                About
              </Link>
              <Link href="/help" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <HelpCircle className="h-4 w-4 inline mr-2" />
                Help
              </Link>
              <Link href="/faq" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <HelpCircle className="h-4 w-4 inline mr-2" />
                FAQ
              </Link>

              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                {user ? (
                  <Link href="/chat">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Go to Chat
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
