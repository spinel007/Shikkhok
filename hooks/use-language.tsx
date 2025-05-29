"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { ReactNode } from "react"
import { useAuth } from "./use-auth"

type Language = "bn" | "en" | "mixed"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    bengali: "Bengali",
    english: "English",
    mixed: "Mixed (Bengali + English)",
    selectLanguage: "Select Language",
    chatPlaceholder: "Type your question...",
    send: "Send",
    thinking: "Thinking...",
    aiTutor: "AI Tutor",
    bengaliLanguageTutor: "Bengali Language Tutor",
    welcomeMessage:
      "Hello! I'm Shikkhok, your Bengali language learning assistant. What would you like to learn today?",
    voiceWelcome: "Hello, I'm Shikkhok, your Bengali tutor.",
  },
  bn: {
    bengali: "বাংলা",
    english: "ইংরেজি",
    mixed: "মিশ্র (বাংলা + ইংরেজি)",
    selectLanguage: "ভাষা নির্বাচন করুন",
    chatPlaceholder: "আপনার প্রশ্ন লিখুন...",
    send: "পাঠান",
    thinking: "চিন্তা করছি...",
    aiTutor: "এআই শিক্ষক",
    bengaliLanguageTutor: "বাংলা ভাষার শিক্ষক",
    welcomeMessage: "আসসালামু আলাইকুম! আমি শিক্ষক, আপনার বাংলা ভাষা শেখার সহায়ক। আজ আপনি কী শিখতে চান?",
    voiceWelcome: "আসসালামু আলাইকুম, আমি শিক্ষক, আপনার বাংলা টিউটর।",
  },
  mixed: {
    bengali: "বাংলা",
    english: "English",
    mixed: "Mixed (বাংলা + English)",
    selectLanguage: "ভাষা নির্বাচন / Select Language",
    chatPlaceholder: "আপনার প্রশ্ন লিখুন / Type your question...",
    send: "পাঠান / Send",
    thinking: "চিন্তা করছি / Thinking...",
    aiTutor: "এআই শিক্ষক / AI Tutor",
    bengaliLanguageTutor: "বাংলা ভাষার শিক্ষক / Bengali Language Tutor",
    welcomeMessage:
      "আসসালামু আলাইকুম! আমি শিক্ষক, আপনার বাংলা ভাষা শেখার সহায়ক। Hello! I'm Shikkhok, your Bengali learning assistant.",
    voiceWelcome: "আসসালামু আলাইকুম, আমি শিক্ষক / Hello, I'm Shikkhok.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("mixed")
  const { user } = useAuth()

  useEffect(() => {
    // Load from user preferences first, then localStorage
    if (user?.preferences?.language) {
      setLanguageState(user.preferences.language)
    } else {
      const saved = localStorage.getItem("shikkhok-language") as Language
      if (saved && ["bn", "en", "mixed"].includes(saved)) {
        setLanguageState(saved)
      }
    }
  }, [user])

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("shikkhok-language", lang)

    // Save to user preferences if logged in
    if (user) {
      try {
        await fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: lang }),
        })
      } catch (error) {
        console.error("Failed to save language preference:", error)
      }
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
