import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Zap, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <div className="h-12 w-12 flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* AI Brain/Head outline */}
                  <circle cx="24" cy="20" r="14" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
                  <circle cx="24" cy="20" r="11" fill="#22c55e" />

                  {/* Neural network nodes */}
                  <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
                  <circle cx="24" cy="14" r="1.5" fill="#ffffff" />
                  <circle cx="30" cy="16" r="1.5" fill="#ffffff" />
                  <circle cx="20" cy="22" r="1.5" fill="#ffffff" />
                  <circle cx="28" cy="22" r="1.5" fill="#ffffff" />
                  <circle cx="24" cy="26" r="1.5" fill="#ffffff" />

                  {/* Neural connections */}
                  <line x1="18" y1="16" x2="24" y2="14" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="24" y1="14" x2="30" y2="16" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="18" y1="16" x2="20" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="30" y1="16" x2="28" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="20" y1="22" x2="24" y2="26" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="28" y1="22" x2="24" y2="26" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

                  {/* Teaching elements - book/knowledge */}
                  <rect x="16" y="36" width="16" height="8" rx="1" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                  <rect x="17" y="37" width="14" height="6" rx="0.5" fill="#ffffff" />
                  <line x1="24" y1="37" x2="24" y2="43" stroke="#16a34a" strokeWidth="0.5" />

                  {/* Bengali character শি (Shi) in the brain */}
                  <text
                    x="24"
                    y="22"
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-white"
                    style={{ fontFamily: "serif" }}
                  >
                    শি
                  </text>

                  {/* Connection between AI and knowledge */}
                  <line x1="24" y1="34" x2="24" y2="36" stroke="#16a34a" strokeWidth="2" strokeDasharray="2,2" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Shikkhok <span className="text-green-600">AI</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your personal AI tutor for learning Bengali language. Master grammar, literature, and all aspects of the
            language with modern artificial intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
              >
                Login
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free to Use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Personalized Learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Shikkhok AI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your personal Bengali tutor, combining modern technology and traditional teaching methods.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Interactive Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Learn through natural conversation. Ask any question and get instant answers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    viewBox="0 0 48 48"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* AI Brain/Head outline */}
                    <circle cx="24" cy="20" r="14" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
                    <circle cx="24" cy="20" r="11" fill="#22c55e" />

                    {/* Neural network nodes */}
                    <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
                    <circle cx="24" cy="14" r="1.5" fill="#ffffff" />
                    <circle cx="30" cy="16" r="1.5" fill="#ffffff" />
                    <circle cx="20" cy="22" r="1.5" fill="#ffffff" />
                    <circle cx="28" cy="22" r="1.5" fill="#ffffff" />
                    <circle cx="24" cy="26" r="1.5" fill="#ffffff" />

                    {/* Neural connections */}
                    <line x1="18" y1="16" x2="24" y2="14" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                    <line x1="24" y1="14" x2="30" y2="16" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                    <line x1="18" y1="16" x2="20" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                    <line x1="30" y1="16" x2="28" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                    <line x1="20" y1="22" x2="24" y2="26" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                    <line x1="28" y1="22" x2="24" y2="26" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

                    {/* Teaching elements - book/knowledge */}
                    <rect x="16" y="36" width="16" height="8" rx="1" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                    <rect x="17" y="37" width="14" height="6" rx="0.5" fill="#ffffff" />
                    <line x1="24" y1="37" x2="24" y2="43" stroke="#16a34a" strokeWidth="0.5" />

                    {/* Bengali character শি (Shi) in the brain */}
                    <text
                      x="24"
                      y="22"
                      textAnchor="middle"
                      className="text-[6px] font-bold fill-white"
                      style={{ fontFamily: "serif" }}
                    >
                      শি
                    </text>

                    {/* Connection between AI and knowledge */}
                    <line x1="24" y1="34" x2="24" y2="36" stroke="#16a34a" strokeWidth="2" strokeDasharray="2,2" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Complete Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Curriculum and exercises organized according to the syllabus of grades 9 and 10.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Fast Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  AI-powered personalized learning method that allows you to learn at your own pace.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Success Stories</h2>

          <div className="grid md:grid-cols-2 gap-8 justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Questions Solved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Bengali Learning Journey Today</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Create a free account and start learning with Shikkhok AI
          </p>

          <Link href="/signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  viewBox="0 0 48 48"
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* AI Brain/Head outline */}
                  <circle cx="24" cy="20" r="14" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
                  <circle cx="24" cy="20" r="11" fill="#22c55e" />

                  {/* Neural network nodes */}
                  <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
                  <circle cx="24" cy="14" r="1.5" fill="#ffffff" />
                  <circle cx="30" cy="16" r="1.5" fill="#ffffff" />
                  <circle cx="20" cy="22" r="1.5" fill="#ffffff" />
                  <circle cx="28" cy="22" r="1.5" fill="#ffffff" />
                  <circle cx="24" cy="26" r="1.5" fill="#ffffff" />

                  {/* Neural connections */}
                  <line x1="18" y1="16" x2="24" y2="14" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="24" y1="14" x2="30" y2="16" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="18" y1="16" x2="20" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="30" y1="16" x2="28" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="20" y1="22" x2="24" y2="26" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="28" y1="22" x2="24" y2="26" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

                  {/* Teaching elements - book/knowledge */}
                  <rect x="16" y="36" width="16" height="8" rx="1" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                  <rect x="17" y="37" width="14" height="6" rx="0.5" fill="#ffffff" />
                  <line x1="24" y1="37" x2="24" y2="43" stroke="#16a34a" strokeWidth="0.5" />

                  {/* Bengali character শি (Shi) in the brain */}
                  <text
                    x="24"
                    y="22"
                    textAnchor="middle"
                    className="text-[6px] font-bold fill-white"
                    style={{ fontFamily: "serif" }}
                  >
                    শি
                  </text>

                  {/* Connection between AI and knowledge */}
                  <line x1="24" y1="34" x2="24" y2="36" stroke="#16a34a" strokeWidth="2" strokeDasharray="2,2" />
                </svg>
                <span className="text-xl font-bold">Shikkhok AI</span>
              </div>
              <p className="text-gray-400">Your trusted AI assistant for learning Bengali</p>
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
                  <Link href="#" className="hover:text-white">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Exercises
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Use
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
