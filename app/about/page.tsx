import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Target, Award, Heart, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Rahim Uddin",
      role: "Chief Linguist",
      description: "20 years of experience in Bengali language and literature",
      image: "👨‍🏫",
    },
    {
      name: "Professor Salma Khatun",
      role: "Education Specialist",
      description: "Expert in modern education methods and research",
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
      description: "Skilled in creating and designing educational content",
      image: "👩‍🎨",
    },
  ]

  const values = [
    {
      icon: BookOpen,
      title: "Quality Education",
      description: "We are committed to providing the highest quality education",
    },
    {
      icon: Users,
      title: "Education for All",
      description: "Open education for all, regardless of age or profession",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Combining modern technology with traditional education",
    },
    {
      icon: Heart,
      title: "Love",
      description: "Deep love for the Bengali language and culture",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <BookOpen className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Us</h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Shikkhok AI is a modern and effective platform for learning the Bengali language. Our goal is to make
            Bengali language learning easier, more engaging, and more effective with the help of artificial
            intelligence.
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
                  To revolutionize Bengali language education and provide every student with the opportunity to learn at
                  their own pace. We want Bengali language learning to be enjoyable and easy to understand.
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
                  To create a world where everyone can easily appreciate the beauty and depth of the Bengali language
                  and express their thoughts through it.
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
              The principles that guide our work and influence our every decision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-green-600" />
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
              In 2023, a group of educators and technologists had a dream - to revolutionize Bengali language education
              by using modern technology. They noticed that traditional education methods had many limitations.
            </p>

            <p className="mb-6">
              To overcome this challenge, they harnessed the power of artificial intelligence to create "Shikkhok AI" -
              a personal Bengali language tutor ready to serve students 24/7.
            </p>

            <p className="mb-6">
              Today, thousands of students are improving their Bengali language skills on our platform. We are proud to
              have initiated a new chapter in Bengali language education.
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
              A team of experienced educators and technologists committed to bringing excellence to Bengali language
              education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.image}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">{member.role}</CardDescription>
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
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Us</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Start your Bengali language learning journey today and become one of our successful students
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start for free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
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
            <p>&copy; 2024 শিক্ষক AI. সকল অধিকার সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
