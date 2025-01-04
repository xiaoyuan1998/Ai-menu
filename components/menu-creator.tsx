'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import { Download, RefreshCw, Upload, ImagePlus } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface MenuItem {
  name: string
  type: string
  description: string
  imageUrl?: string
  isGenerating?: boolean
}

const texts = {
  zh: {
    dropzoneText: "拖放图片到这里，或点击上传",
    uploadButton: "选择文件",
    orText: "或者",
    createNewButton: "从头开始创建",
    analyzingImage: "正在分析图片...",
    generatingImage: "生成中...",
    reGenerateButton: "重新生成",
    startOverButton: "重新开始",
    generateButton: "点击生成图片",
    detectedDishes: "识别到的菜品",
    generateNowButton: "立即生成图片"
  },
  fr: {
    dropzoneText: "Déposez vos images ici ou cliquez pour télécharger",
    uploadButton: "Sélectionner un fichier",
    orText: "ou",
    createNewButton: "Créer à partir de zéro",
    analyzingImage: "Analyse de l'image en cours...",
    generatingImage: "Génération en cours...",
    reGenerateButton: "Regénérer",
    startOverButton: "Recommencer",
    generateButton: "Cliquer pour générer l'image",
    detectedDishes: "Plats détectés",
    generateNowButton: "Générer l'image maintenant"
  },
  it: {
    dropzoneText: "Trascina le immagini qui o clicca per caricare",
    uploadButton: "Seleziona file",
    orText: "oppure",
    createNewButton: "Crea da zero",
    analyzingImage: "Analisi dell'immagine in corso...",
    generatingImage: "Generazione in corso...",
    reGenerateButton: "Rigenera",
    startOverButton: "Ricomincia",
    generateButton: "Clicca per generare l'immagine",
    detectedDishes: "Piatti rilevati",
    generateNowButton: "Genera l'immagine ora"
  }
}

export function MenuCreator() {
  const { language } = useLanguage()
  const t = texts[language]
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)

  const processImage = async (file: File) => {
    setIsLoading(true)
    setProgress(0)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const analyzeResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await analyzeResponse.json()
      setMenuItems(data.dishes.map((dish: any) => ({
        ...dish,
        imageUrl: undefined,
        isGenerating: false
      })))
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const generateImage = async (dish: MenuItem) => {
    const updatedItems = menuItems.map(item =>
      item.name === dish.name ? { ...item, isGenerating: true } : item
    )
    setMenuItems(updatedItems)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: dish.name,
          language: language
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.name === dish.name
            ? { ...item, imageUrl: data.imageUrl, isGenerating: false }
            : item
        )
      )
    } catch (error) {
      console.error('Error generating image:', error)
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.name === dish.name
            ? { ...item, isGenerating: false }
            : item
        )
      )
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      processImage(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  })

  return (
    <div id="create" className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">{t.dropzoneText}</p>
            <Button variant="outline" className="mt-4">
              {t.uploadButton}
            </Button>
          </div>


          {isLoading && (
            <div className="mt-8">
              <Progress value={progress} className="mb-2" />
              <p className="text-center text-sm text-gray-500">
                {t.analyzingImage}
              </p>
            </div>
          )}

          {menuItems.length > 0 && (
            <>
              <div className="mt-8 mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t.detectedDishes}（{menuItems.length}）</h2>
                <Button onClick={() => setMenuItems([])}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.startOverButton}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      {item.imageUrl ? (
                        <>
                          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {item.isGenerating && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                  <p className="text-sm">{t.generatingImage}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              variant="outline"
                              onClick={() => generateImage(item)}
                              disabled={item.isGenerating}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              {t.reGenerateButton}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          {item.isGenerating ? (
                            <div className="text-center">
                              <RefreshCw className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
                              <p className="text-sm text-gray-500">{t.generatingImage}</p>
                            </div>
                          ) : (
                            <Button
                              onClick={() => generateImage(item)}
                              className="flex-1"
                            >
                              <ImagePlus className="w-4 h-4 mr-2" />
                              {t.generateNowButton}
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="mt-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
