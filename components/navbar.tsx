"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">শিক্ষক AI</span>
          </Link>

          {/* Desktop Navigation */}

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
            </Link>
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
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
