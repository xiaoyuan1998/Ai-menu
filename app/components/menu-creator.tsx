'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../contexts/language-context'
import { useApiKeys } from '../contexts/api-keys-context'
import { translations } from '../lib/translations'

export function MenuCreator() {
  const [dishName, setDishName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { language } = useLanguage()
  const { openrouterKey, falKey } = useApiKeys()
  const t = translations[language].menuCreator

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!openrouterKey || !falKey) {
        throw new Error(t.apiKeyError)
      }

      // 1. Generate image with fal.ai
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: dishName,
          language,
          openrouterKey,
          falKey
        }),
      })

      if (!generateResponse.ok) {
        const data = await generateResponse.json()
        throw new Error(data.error || t.generateError)
      }

      const generateData = await generateResponse.json()
      setImageUrl(generateData.images[0].url) // Use the direct fal.media URL

      // 2. Analyze the generated image
      const formData = new FormData()
      formData.append('falResponse', JSON.stringify(generateData))

      const analyzeResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      if (!analyzeResponse.ok) {
        const data = await analyzeResponse.json()
        throw new Error(data.error || t.analyzeError)
      }

      const analyzeData = await analyzeResponse.json()
      console.log('Analysis result:', analyzeData)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="dish-name" className="block text-sm font-medium text-gray-700">
            {t.dishNameLabel}
          </label>
          <input
            type="text"
            id="dish-name"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder={t.dishNamePlaceholder}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !dishName}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? t.generating : t.generate}
        </button>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{t.error}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="mt-8">
            <div className="relative w-full aspect-square">
              <Image
                src={imageUrl}
                alt={dishName}
                fill
                className="object-cover rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
