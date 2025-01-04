'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MenuExamples } from '@/components/menu-examples'
import { MenuSuggestions } from '@/components/menu-suggestions'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { ChefHat, Camera, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { FeatureCard } from '@/components/feature-card'
import { MenuCreator } from '@/components/menu-creator'

export default function Home() {
  const { language } = useLanguage();

  const texts = {
    zh: {
      title: "AI 美食菜单生成器",
      subtitle: "将您的菜单转化为视觉盛宴。利用AI技术,为每道菜品创造令人垂涎的图片,提升您的菜单吸引力,增加顾客点餐欲望。",
      createButton: "开始创建",
      suggestionsTitle: "经典菜品推荐",
      examplesTitle: "成功案例展示",
      howItWorksTitle: "简单三步,菜单大变身",
      uploadMenu: "上传菜单",
      aiAnalysis: "AI 智能分析",
      generateImages: "生成诱人图片",
      uploadDesc: "只需上传您的菜单图片或文本文件,AI就开始工作",
      analysisDesc: "我们的AI会精准识别每道菜品,理解其特点",
      generateDesc: "为每道菜品生成独特、吸引人的高质量图片",
      footer: " 2023 AI美食菜单生成器. 保留所有权利."
    },
    fr: {
      title: "Générateur de Menu AI",
      subtitle: "Transformez vos menus en un festin visuel. En utilisant la technologie AI, créez des images appétissantes pour chaque plat, améliorez l'attrait de vos menus et augmentez la volonté de vos clients de commander.",
      createButton: "Commencer",
      suggestionsTitle: "Suggestions de Plats Classiques",
      examplesTitle: "Exemples de Réussite",
      howItWorksTitle: "Trois étapes simples, menu transformé",
      uploadMenu: "Télécharger le menu",
      aiAnalysis: "Analyse intelligente AI",
      generateImages: "Générer des images appétissantes",
      uploadDesc: "Il suffit de télécharger votre menu en image ou en texte, et l'IA commence à travailler",
      analysisDesc: "Notre IA identifie précisément chaque plat et comprend ses caractéristiques",
      generateDesc: "Génère des images uniques et attrayantes de haute qualité pour chaque plat",
      footer: " 2023 Générateur de Menu AI. Tous droits réservés."
    },
    it: {
      title: "Generatore di Menu AI",
      subtitle: "Trasforma i tuoi menu in un festino visivo. Utilizzando la tecnologia AI, crea immagini appetitose per ogni piatto, migliora l'attrattiva dei tuoi menu e aumenta la volontà dei tuoi clienti di ordinare.",
      createButton: "Inizia",
      suggestionsTitle: "Suggerimenti di Piatti Classici",
      examplesTitle: "Esempi di Successo",
      howItWorksTitle: "Tre passaggi semplici, menu trasformato",
      uploadMenu: "Caricare il menu",
      aiAnalysis: "Analisi intelligente AI",
      generateImages: "Generare immagini appetitose",
      uploadDesc: "Basta caricare il tuo menu in immagine o testo e l'IA inizia a lavorare",
      analysisDesc: "La nostra IA identifica con precisione ogni piatto e ne comprende le caratteristiche",
      generateDesc: "Genera immagini uniche e attraenti di alta qualità per ogni piatto",
      footer: " 2023 Generatore di Menu AI. Tutti i diritti riservati."
    }
  };

  const t = texts[language];

  return (
    <main>
      <section className="min-h-[20vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 font-playfair">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      <section id="create" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <MenuCreator />
        </div>
      </section>

      <section id="how-it-works" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-playfair">
            {t.howItWorksTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="w-12 h-12 text-primary" />}
              title={t.uploadMenu}
              description={t.uploadDesc}
            />
            <FeatureCard
              icon={<ChefHat className="w-12 h-12 text-primary" />}
              title={t.aiAnalysis}
              description={t.analysisDesc}
            />
            <FeatureCard
              icon={<Sparkles className="w-12 h-12 text-primary" />}
              title={t.generateImages}
              description={t.generateDesc}
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-playfair">
            {t.suggestionsTitle}
          </h2>
          <MenuSuggestions />
        </div>
      </section>

      <section id="examples" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-playfair">
            {t.examplesTitle}
          </h2>
          <MenuExamples />
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>{t.footer}</p>
        </div>
      </footer>
    </main>
  )
}
