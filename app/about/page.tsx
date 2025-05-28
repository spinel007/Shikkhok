import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Target, Award, Heart, Lightbulb, School } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Rahim Uddin",
      role: "Education Specialist",
      description: "20 years of experience with NCTB curriculum",
      image: "👨‍🏫",
    },
    {
      name: "Professor Salma Khatun",
      role: "Curriculum Expert",
      description: "Former NCTB advisor and educational researcher",
      image: "👩‍🏫",
    },
    {
      name: "Mohammad Karim",
      role: "AI Developer",
      description: "Artificial intelligence and machine learning expert",
      image: "👨‍💻",
    },
    {
      name: "Fatema Akter",
      role: "Content Designer",
      description: "Specialized in NCTB textbook content adaptation",
      image: "👩‍🎨",
    },
  ]

  const values = [
    {
      icon: School,
      title: "NCTB Excellence",
      description: "Committed to accurately representing the complete national curriculum",
    },
    {
      icon: Users,
      title: "Education for All",
      description: "Making quality education accessible to students across Bangladesh",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Combining modern AI technology with traditional NCTB curriculum",
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Dedicated to helping every student achieve their academic goals",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Us</h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Shikkhok AI is a modern and effective platform for learning the complete NCTB curriculum (Classes 1-12) in
            Bengali language. Our goal is to make education more accessible, engaging, and effective with the help of
            artificial intelligence.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To revolutionize NCTB curriculum education by providing every student with AI-powered learning
                  assistance. We aim to make the National Curriculum and Textbook Board syllabus more accessible,
                  understandable, and engaging for students across Bangladesh.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To create a world where every student in Bangladesh has equal access to high-quality education through
                  AI-powered learning of the NCTB curriculum, enabling them to achieve academic excellence and reach
                  their full potential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work in delivering NCTB curriculum through AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              In 2023, a group of educators and technologists came together with a shared vision - to revolutionize how
              students in Bangladesh learn the NCTB curriculum. They recognized that traditional education methods had
              limitations, especially for students who needed additional support outside the classroom.
            </p>

            <p className="mb-6">
              To address this challenge, they harnessed the power of artificial intelligence to create "Shikkhok AI" - a
              personal AI tutor specialized in the National Curriculum and Textbook Board syllabus for Classes 1-12,
              available to students 24/7 in Bengali language.
            </p>

            <p className="mb-6">
              Today, thousands of students across Bangladesh are improving their understanding of NCTB subjects through
              our platform. We are proud to be contributing to the educational development of students nationwide,
              helping them achieve academic success through innovative AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A team of experienced educators and technologists committed to bringing excellence to NCTB curriculum
              education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.image}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Us</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your NCTB curriculum learning journey today with our AI-powered educational platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start for free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
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
                Your trusted AI assistant for learning NCTB curriculum (Classes 1-12) in Bengali language
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
