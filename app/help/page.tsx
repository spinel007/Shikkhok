import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  MessageSquare,
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  Mail,
  Phone,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HelpPage() {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Guide to start using the platform",
      articles: 8,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Using Chat",
      description: "Rules for conversation with AI Tutor",
      articles: 12,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage profile and settings",
      articles: 6,
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      description: "Subscription and payment related",
      articles: 5,
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Security of your data",
      articles: 4,
      color: "bg-red-100 text-red-600",
    },
    {
      icon: HelpCircle,
      title: "Common Issues",
      description: "Frequently Asked Questions",
      articles: 15,
      color: "bg-gray-100 text-gray-600",
    },
  ]

  const popularArticles = [
    {
      title: "How to start chatting with the AI teacher?",
      category: "Getting Started",
      readTime: "3 minutes",
      views: "1,234",
    },
    {
      title: "Rules for updating your profile",
      category: "Account",
      readTime: "2 minutes",
      views: "890",
    },
    {
      title: "How to access the curriculum?",
      category: "Curriculum",
      readTime: "4 minutes",
      views: "756",
    },
    {
      title: "Rules for participating in practice tests",
      category: "Practice",
      readTime: "5 minutes",
      views: "643",
    },
    {
      title: "Method to reset password",
      category: "Security",
      readTime: "2 minutes",
      views: "521",
    },
  ]

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@shikkhok-ai.com",
      responseTime: "Within 24 hours",
      available: true,
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant help",
      responseTime: "Typically 5 minutes",
      available: true,
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+880 1712-345678",
      responseTime: "9 AM - 6 PM",
      available: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to your questions or contact our support team</p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Write your question..."
              className="pl-12 h-14 text-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Help Categories</h2>
            <p className="text-lg text-gray-600">Choose a category based on your need</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={"w-12 h-12 " + category.color + " rounded-lg flex items-center justify-center mb-4"}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{category.articles} Articles</Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
            <p className="text-lg text-gray-600">Most read help articles</p>
          </div>

          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </div>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <Button variant="outline">Read</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-lg text-gray-600">Contact our support team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <Card
                key={index}
                className={"text-center " + (!option.available ? "opacity-60" : "hover:shadow-lg transition-shadow")}
              >
                <CardHeader>
                  <div
                    className={
                      "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 " +
                      (option.available ? "bg-green-100" : "bg-gray-100")
                    }
                  >
                    <option.icon className={"h-8 w-8 " + (option.available ? "text-green-600" : "text-gray-400")} />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-lg">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{option.responseTime}</p>
                  <Button
                    className={option.available ? "bg-green-600 hover:bg-green-700" : ""}
                    disabled={!option.available}
                  >
                    {option.available ? "Contact Us" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is Shikkhok AI free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, the core features of Shikkhok AI are completely free to use. However, a subscription is required
                  for premium features.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What age students can use it?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Shikkhok AI is suitable for students of all ages. However, it is primarily designed according to the
                  syllabus of grades 9 and 10.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data safe?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We ensure the highest security of your personal information and learning data. See our privacy policy
                  for details.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="outline" size="lg">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">শিক্ষক AI</span>
              </div>
              <p className="text-gray-400">বাংলা ভাষা শেখার জন্য আপনার বিশ্বস্ত AI সহায়ক</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">পণ্য</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/chat" className="hover:text-white">
                    চ্যাট
                  </Link>
                </li>
                <li>
                  <Link href="/lessons" className="hover:text-white">
                    পাঠ্যক্রম
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-white">
                    অনুশীলনী
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">সহায়তা</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    সাহায্য কেন্দ্র
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    যোগাযোগ
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
              <h3 className="font-semibold mb-4">কোম্পানি</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    আমাদের সম্পর্কে
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    গোপনীয়তা নীতি
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    ব্যবহারের শর্তাবলী
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; ২০২৪ শিক্ষক AI. সকল অধিকার সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
