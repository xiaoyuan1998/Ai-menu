'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface MenuItem {
  name: string
  description: string
  imageUrl: string
}

export function MenuGenerator() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setMenuItems([...menuItems, { name, description, imageUrl: data.imageUrl }])
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="菜品名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder="菜品描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '生成中...' : '生成菜品图片'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

