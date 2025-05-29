import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Zap, ArrowRight, CheckCircle } from "lucide-react"
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
              <BookOpen className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            শিক্ষক <span className="text-green-600">AI</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            বাংলা ভাষা শেখার জন্য আপনার ব্যক্তিগত AI টিউটর। ব্যাকরণ, সাহিত্য এবং ভাষার সকল দিক শিখুন আধুনিক কৃত্রিম বুদ্ধিমত্তার সাহায্যে।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                বিনামূল্যে শুরু করুন
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
              >
                লগইন করুন
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>বিনামূল্যে ব্যবহার</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>২৪/৭ সহায়তা</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>ব্যক্তিগত শিক্ষা</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">কেন শিক্ষক AI বেছে নেবেন?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              আধুনিক প্রযুক্তি এবং ঐতিহ্যবাহী শিক্ষা পদ্ধতির সমন্বয়ে তৈরি আপনার ব্যক্তিগত বাংলা টিউটর
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">ইন্টারঅ্যাক্টিভ চ্যাট</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  প্রাকৃতিক কথোপকথনের মাধ্যমে শিখুন। যেকোনো প্রশ্ন করুন এবং তাৎক্ষণিক উত্তর পান।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">সম্পূর্ণ পাঠ্যক্রম</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  ৯ম ও ১০ম শ্রেণীর সিলেবাস অনুযায়ী সাজানো পাঠ্যক্রম এবং অনুশীলনী।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">দ্রুত শিক্ষা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  AI-চালিত ব্যক্তিগত শিক্ষা পদ্ধতি যা আপনার গতিতে শেখার সুবিধা দেয়।
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">আমাদের সাফল্যের গল্প</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">১০,০০০+</div>
              <div className="text-gray-600">সক্রিয় শিক্ষার্থী</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">৫০,০০০+</div>
              <div className="text-gray-600">সমাধানকৃত প্রশ্ন</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">৯৮%</div>
              <div className="text-gray-600">সন্তুষ্ট ব্যবহারকারী</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">আজই শুরু করুন আপনার বাংলা শেখার যাত্রা</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            বিনামূল্যে অ্যাকাউন্ট তৈরি করুন এবং শিক্ষক AI এর সাথে শিখতে শুরু করুন
          </p>

          <Link href="/signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
              এখনই যোগ দিন
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
                  <Link href="#" className="hover:text-white">
                    পাঠ্যক্রম
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    অনুশীলনী
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">সহায়তা</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    সাহায্য কেন্দ্র
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    যোগাযোগ
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
              <h3 className="font-semibold mb-4">কোম্পানি</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    আমাদের সম্পর্কে
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    গোপনীয়তা নীতি
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
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
