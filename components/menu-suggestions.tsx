'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, ImagePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

interface Dish {
  id: string
  name: string
  description: string
  category: string
  imageUrl?: string
  isGenerating?: boolean
  language: string
}

interface DishCardProps {
  id: string
  name: string
  description: string
  category: string
  imageUrl?: string
  isGenerating?: boolean
  generateImage: (id: string) => void
}

const texts = {
  zh: {
    generating: "生成中...",
    regenerateImage: "重新生成图片",
    generateNow: "立即生成图片"
  },
  fr: {
    generating: "Génération en cours...",
    regenerateImage: "Regénérer l'image",
    generateNow: "Générer l'image maintenant"
  },
  it: {
    generating: "Generazione in corso...",
    regenerateImage: "Rigenera l'immagine",
    generateNow: "Genera l'immagine ora"
  }
}

function DishCard({ id, name, description, category, imageUrl, isGenerating, generateImage }: DishCardProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const t = texts[language]

  const handleTryNow = () => {
    router.push(`/create?dishes=${encodeURIComponent(name)}`)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <span className="text-sm text-gray-500">{category}</span>
          <p className="text-gray-600 text-sm mt-2 mb-4">{description}</p>
        </div>
        {imageUrl ? (
          <>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">{t.generating}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => generateImage(id)}
                variant="outline"
                className="w-full"
                disabled={isGenerating}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.regenerateImage}
              </Button>
            </div>
          </>
        ) : (
          <Button 
            onClick={() => generateImage(id)}
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {t.generating}
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 mr-2" />
                {t.generateNow}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function MenuSuggestions() {
  const { language } = useLanguage();

  const allDishes = {
    zh: [
      {
        id: '1',
        name: "宫保鸡丁",
        description: "经典川菜，将鸡肉切丁与花生、干辣椒一起爆炒，口感麻辣鲜香",
        category: "川菜",
        imageUrl: undefined,
        isGenerating: false,
        language: "zh"
      },
      {
        id: '2',
        name: "红烧肉",
        description: "传统名菜，肥而不腻，入口即化，红亮诱人",
        category: "本帮菜",
        imageUrl: undefined,
        isGenerating: false,
        language: "zh"
      },
      {
        id: '3',
        name: "麻婆豆腐",
        description: "香辣可口的川菜代表，嫩滑的豆腐配上麻辣的酱汁",
        category: "川菜",
        imageUrl: undefined,
        isGenerating: false,
        language: "zh"
      },
      {
        id: '4',
        name: "糖醋里脊",
        description: "外酥里嫩，酸甜可口，深受欢迎的传统名菜",
        category: "鲁菜",
        imageUrl: undefined,
        isGenerating: false,
        language: "zh"
      },
      {
        id: '5',
        name: "水煮鱼",
        description: "鱼片鲜嫩，汤汁麻辣，是一道经典的川菜",
        category: "川菜",
        imageUrl: undefined,
        isGenerating: false,
        language: "zh"
      },
      {
        id: '6',
        name: "东坡肉",
        description: "入口即化的红烧肉，带有浓郁的酱香味",
        category: "浙菜",
        imageUrl: undefined,
        isGenerating: false,
        language: "zh"
      }
    ],
    fr: [
      {
        id: '7',
        name: "Boeuf Bourguignon",
        description: "Bœuf mijoté au vin rouge avec des champignons et des lardons",
        category: "Bourgogne",
        imageUrl: undefined,
        isGenerating: false,
        language: "fr"
      },
      {
        id: '8',
        name: "Cassoulet",
        description: "Haricots blancs mijotés avec de la viande confite et des saucisses",
        category: "Sud-Ouest",
        imageUrl: undefined,
        isGenerating: false,
        language: "fr"
      },
      {
        id: '9',
        name: "Confit de Canard",
        description: "Cuisse de canard confite servie avec des pommes sarladaises",
        category: "Sud-Ouest",
        imageUrl: undefined,
        isGenerating: false,
        language: "fr"
      },
      {
        id: '10',
        name: "Blanquette de Veau",
        description: "Veau mijoté en sauce blanche avec des champignons",
        category: "Classique",
        imageUrl: undefined,
        isGenerating: false,
        language: "fr"
      },
      {
        id: '11',
        name: "Quiche Lorraine",
        description: "Tarte salée aux lardons et à la crème",
        category: "Lorraine",
        imageUrl: undefined,
        isGenerating: false,
        language: "fr"
      },
      {
        id: '12',
        name: "Ratatouille Niçoise",
        description: "Légumes du sud mijotés à l'huile d'olive",
        category: "Provence",
        imageUrl: undefined,
        isGenerating: false,
        language: "fr"
      }
    ],
    it: [
      {
        id: '13',
        name: "Risotto alla Milanese",
        description: "Risotto allo zafferano con parmigiano",
        category: "Milano",
        imageUrl: undefined,
        isGenerating: false,
        language: "it"
      },
      {
        id: '14',
        name: "Pasta all'Amatriciana",
        description: "Pasta con guanciale, pomodoro e pecorino",
        category: "Roma",
        imageUrl: undefined,
        isGenerating: false,
        language: "it"
      },
      {
        id: '15',
        name: "Vitello Tonnato",
        description: "Fette di vitello con salsa al tonno",
        category: "Piemonte",
        imageUrl: undefined,
        isGenerating: false,
        language: "it"
      },
      {
        id: '16',
        name: "Parmigiana di Melanzane",
        description: "Melanzane al forno con pomodoro e mozzarella",
        category: "Sicilia",
        imageUrl: undefined,
        isGenerating: false,
        language: "it"
      },
      {
        id: '17',
        name: "Bistecca alla Fiorentina",
        description: "Bistecca di manzo alla griglia",
        category: "Toscana",
        imageUrl: undefined,
        isGenerating: false,
        language: "it"
      },
      {
        id: '18',
        name: "Pasta alla Norma",
        description: "Pasta con melanzane, pomodoro e ricotta salata",
        category: "Sicilia",
        imageUrl: undefined,
        isGenerating: false,
        language: "it"
      }
    ]
  };

  const [dishes, setDishes] = useState<Dish[]>(allDishes[language]);

  useEffect(() => {
    setDishes(allDishes[language]);
  }, [language]);

  const generateImage = async (id: string) => {
    const index = dishes.findIndex(dish => dish.id === id)
    if (index === -1) return
    
    const dish = dishes[index]
    if (dish.isGenerating) return

    try {
      setDishes(prevDishes => {
        const updatedDishes = [...prevDishes]
        updatedDishes[index] = { ...dish, isGenerating: true }
        return updatedDishes
      })

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: dish.name }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      setDishes(prevDishes => {
        const updatedDishes = [...prevDishes]
        updatedDishes[index] = {
          ...updatedDishes[index],
          imageUrl: data.imageUrl,
          isGenerating: false
        }
        return updatedDishes
      })
    } catch (error) {
      console.error('Error generating image:', error)
      setDishes(prevDishes => {
        const updatedDishes = [...prevDishes]
        updatedDishes[index] = { ...updatedDishes[index], isGenerating: false }
        return updatedDishes
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <DishCard 
          key={dish.id} 
          id={dish.id} 
          name={dish.name} 
          description={dish.description} 
          category={dish.category} 
          imageUrl={dish.imageUrl}
          isGenerating={dish.isGenerating}
          generateImage={generateImage}
        />
      ))}
    </div>
  )
}
