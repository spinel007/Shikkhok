import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Brain, ArrowRight, CheckCircle, Sparkles, Users, TrendingUp, School } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Shikkhok{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience AI-powered learning for NCTB curriculum in Bengali language. Get personalized education on all
            subjects from the National Curriculum and Textbook Board of Bangladesh.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                Try AI Chat
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>NCTB Curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Classes 1-12</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>All Subjects</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>24/7 Available</span>
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
              The most advanced AI tutor for NCTB curriculum, providing personalized, efficient, and engaging learning
              experiences in Bengali language.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Engage with our advanced AI tutor through natural conversation in Bengali. Get instant, intelligent
                  responses to any question about NCTB curriculum subjects.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Complete NCTB Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Access the entire National Curriculum and Textbook Board syllabus for Classes 1-12, with comprehensive
                  coverage of all subjects.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Personalized Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  AI adapts to your learning style and pace, providing customized explanations and practice for each
                  NCTB subject and grade level.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">NCTB Curriculum Coverage</h2>

          <div className="grid md:grid-cols-3 gap-8 justify-center">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-gray-600">Class Levels</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">NCTB Subjects</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Textbook Chapters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All NCTB Subjects Covered</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI tutor can help you learn and understand every subject in the National Curriculum and Textbook Board
              syllabus
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-green-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                π
              </div>
              <h3 className="font-semibold text-gray-900">Mathematics</h3>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-purple-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                📝
              </div>
              <h3 className="font-semibold text-gray-900">Accounting</h3>
            </div>

            <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-green-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                💼
              </div>
              <h3 className="font-semibold text-gray-900">Business Studies</h3>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-indigo-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                💻
              </div>
              <h3 className="font-semibold text-gray-900">ICT</h3>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-yellow-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                🧪
              </div>
              <h3 className="font-semibold text-gray-900">Physics</h3>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-teal-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                🧬
              </div>
              <h3 className="font-semibold text-gray-900">Biology</h3>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-pink-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                🧪
              </div>
              <h3 className="font-semibold text-gray-900">Chemistry</h3>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-2xl font-bold mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                📊
              </div>
              <h3 className="font-semibold text-gray-900">Higher Math</h3>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced AI Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience cutting-edge artificial intelligence features designed specifically for NCTB curriculum
              learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">NCTB Curriculum Expert</h3>
                <p className="text-gray-600">
                  AI is trained on the complete National Curriculum and Textbook Board syllabus for all classes and
                  subjects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Adaptive Learning</h3>
                <p className="text-gray-600">
                  AI adjusts to your learning level, providing simpler or more advanced explanations based on your
                  understanding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Questions</h3>
                <p className="text-gray-600">
                  Generate unlimited practice questions and mock tests based on NCTB textbooks and exam patterns.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Format Learning</h3>
                <p className="text-gray-600">
                  Learn through text, images, and interactive exercises - all aligned with NCTB curriculum requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Master the NCTB Curriculum with AI Assistance
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students excelling in their studies with our advanced AI tutor for Classes 1-12
          </p>

          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Shikkhok AI</span>
              </div>
              <p className="text-gray-400">
                Your advanced AI learning companion for NCTB curriculum (Classes 1-12) in Bengali language
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    AI Chat
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    NCTB Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    Practice Tests
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
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shikkhok AI. All rights reserved. Powered by Advanced Artificial Intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
