import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, BookOpen } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@shikkhok-ai.com",
      responseTime: "Within 24 hours",
      available: true,
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available in app",
      responseTime: "Usually within 5 minutes",
      available: true,
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+880 1712-345678",
      responseTime: "9 AM - 6 PM (GMT+6)",
      available: false,
    },
  ]

  const officeLocations = [
    {
      city: "Dhaka",
      address: "House 123, Road 45, Dhanmondi, Dhaka 1205, Bangladesh",
      phone: "+880 2-9876543",
      email: "dhaka@shikkhok-ai.com",
    },
    {
      city: "Chittagong",
      address: "Building 67, GEC Circle, Chittagong 4000, Bangladesh",
      phone: "+880 31-654321",
      email: "chittagong@shikkhok-ai.com",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 mb-8">
            Have questions or need help? We're here to assist you on your Bengali learning journey.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">Choose the best way to reach us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className={`text-center ${!method.available ? "opacity-60" : "hover:shadow-lg transition-shadow"}`}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      method.available ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <method.icon className={`h-8 w-8 ${method.available ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-900 mb-2">{method.contact}</p>
                  <p className="text-sm text-gray-600 mb-4">{method.responseTime}</p>
                  <Button
                    className={method.available ? "bg-green-600 hover:bg-green-700" : ""}
                    disabled={!method.available}
                  >
                    {method.available ? "Contact Now" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
            <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you soon</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="resize-none"
                  />
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 h-12">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Offices</h2>
            <p className="text-lg text-gray-600">Visit us at our locations across Bangladesh</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {officeLocations.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    {office.city} Office
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{office.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">{office.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">{office.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How quickly do you respond to support requests?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We aim to respond to all email inquiries within 24 hours. For urgent matters, our live chat support is
                  available and typically responds within 5 minutes during business hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer phone support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Phone support is currently in development and will be available soon. For now, please use our email
                  support or live chat for the fastest assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I visit your office for in-person support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! We welcome visitors at our Dhaka and Chittagong offices. Please contact us in advance to schedule
                  an appointment and ensure someone is available to assist you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What information should I include in my support request?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Please include your account email, a detailed description of the issue, any error messages you've
                  seen, and steps you've already tried. Screenshots are also very helpful for technical issues.
                </p>
              </CardContent>
            </Card>
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
