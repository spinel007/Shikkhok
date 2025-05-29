"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronUp, BookOpen, MessageSquare, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>(["getting-started-1"])

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      faqs: [
        {
          id: "getting-started-1",
          question: "How do I create an account on Shikkhok AI?",
          answer:
            "Creating an account is simple! Click the 'Sign Up' button on our homepage, fill in your details, and verify your email. You can also sign up using your Google account for faster registration.",
          tags: ["account", "registration", "signup"],
        },
        {
          id: "getting-started-2",
          question: "Is Shikkhok AI free to use?",
          answer:
            "Yes! Shikkhok AI offers a free plan that includes basic chat functionality, access to fundamental lessons, and practice exercises. Premium features are available with our paid plans.",
          tags: ["pricing", "free", "premium"],
        },
      ],
    },
    {
      id: "chat-features",
      title: "Chat & AI Features",
      icon: MessageSquare,
      color: "bg-green-100 text-green-600",
      faqs: [
        {
          id: "chat-1",
          question: "How does the AI tutor work?",
          answer:
            "Our AI tutor uses advanced language models trained specifically for Bengali language education. It can answer questions, provide explanations, correct grammar, and offer personalized learning suggestions based on your progress.",
          tags: ["ai", "tutor", "chat"],
        },
      ],
    },
  ]

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 mb-8">Find quick answers to common questions about Shikkhok AI</p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {!searchTerm && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
              <p className="text-lg text-gray-600">Select a category to find relevant answers</p>
            </div>
          )}

          {!searchTerm && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {faqCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.faqs.length} questions</CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="space-y-8">
            {filteredFAQs.map((category) => {
              const IconComponent = category.icon
              return (
                <div key={category.id}>
                  {searchTerm && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                      <Badge variant="secondary">{category.faqs.length} results</Badge>
                    </div>
                  )}

                  <div className="space-y-4">
                    {category.faqs.map((faq) => (
                      <Card key={faq.id}>
                        <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                                {openItems.includes(faq.id) ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <p className="text-gray-600 leading-relaxed mb-4">{faq.answer}</p>
                              <div className="flex flex-wrap gap-2">
                                {faq.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We could not find any FAQs matching {searchTerm}. Try different keywords or browse by category.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Cannot find what you are looking for? Our support team is here to help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline">
                Visit Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">Shikkhok AI</span>
              </div>
              <p className="text-gray-400">Your trusted AI companion for learning Bengali language</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/chat" className="hover:text-white">
                    Chat
                  </Link>
                </li>
                <li>
                  <Link href="/lessons" className="hover:text-white">
                    Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-white">
                    Practice
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Shikkhok AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
