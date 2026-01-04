"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Language, translations } from "./translations"

type Translations = typeof translations.pl

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pl")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    const validLanguages: Language[] = ["pl", "en", "de", "fr", "es", "it", "pt", "ru", "zh-CN", "ja"]
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    // Update HTML lang attribute
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang
    }
  }

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  const t = translations[language]

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

