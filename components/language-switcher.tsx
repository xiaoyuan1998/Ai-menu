'use client'

import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'

const languages = {
  zh: "中文",
  fr: "Français",
  it: "Italiano"
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {Object.entries(languages).map(([code, name]) => (
        <Button
          key={code}
          variant={language === code ? "default" : "outline"}
          onClick={() => setLanguage(code as any)}
          className="min-w-[80px]"
        >
          {name}
        </Button>
      ))}
    </div>
  )
}
