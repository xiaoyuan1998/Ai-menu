'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'zh' | 'fr' | 'it'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language')
      return (savedLanguage && ['zh', 'fr', 'it'].includes(savedLanguage)) ? savedLanguage as Language : 'zh'
    }
    return 'zh'
  })

  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage)
    setLanguageState(newLanguage)
    // 不再需要重新加载页面
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
