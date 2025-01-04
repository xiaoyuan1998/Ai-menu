'use client'

import { MenuCreator } from '@/components/menu-creator'
import { useLanguage } from '@/contexts/language-context'

const texts = {
  zh: {
    title: "创建您的AI美食菜单",
    subtitle: "上传您的菜单或者从头开始创建"
  },
  fr: {
    title: "Créez votre menu AI",
    subtitle: "Téléchargez votre menu ou commencez à partir de zéro"
  },
  it: {
    title: "Crea il tuo menu AI",
    subtitle: "Carica il tuo menu o inizia da zero"
  }
}

export default function MenuCreatorPage() {
  const { language } = useLanguage()
  const t = texts[language]

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>
        <MenuCreator />
      </div>
    </main>
  )
}
