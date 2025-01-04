'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import { Download, RefreshCw } from 'lucide-react'
import MenuList from './MenuList'

interface MenuItem {
  id: string
  name: string
  description: string
  imageUrl: string | null
  isGenerating: boolean
  originalImage?: string
  format?: 'base64' | 'url'
  contentType?: string
}

export default function MenuCreator() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Starting file upload process')
    setIsProcessing(true)
    setUploadProgress(0)
    
    for (const file of acceptedFiles) {
      console.log('Processing file:', file.name)
      const processFile = async (file: File) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
        })
        
        const newItem: MenuItem = {
          id: Date.now().toString(),
          name: '识别中...',
          description: '',
          imageUrl: null,
          isGenerating: true,
          originalImage: imageUrl
        }
        console.log('Created new menu item:', newItem)
        
        try {
          setMenuItems(prev => [...prev, newItem])
          
          // 上传图片并获取AI识别结果
          console.log('Uploading image for analysis')
          const formData = new FormData()
          formData.append('image', file)
          
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            body: formData
          })
          
          if (!response.ok) {
            throw new Error(`Failed to analyze image: ${response.statusText}`)
          }
          
          const data = await response.json()
          console.log('Analysis response:', data)
          
          // 更新菜品信息
          console.log('Updating menu item with analysis results')
          setMenuItems(items =>
            items.map(item =>
              item.id === newItem.id
                ? {
                    ...item,
                    name: data.name,
                    description: data.description,
                    isGenerating: true
                  }
                : item
            )
          )
          
          // 生成AI图片
          console.log('Requesting AI image generation')
          const requestBody = {
            name: data.name,
            description: data.description
          }
          console.log('Image generation request:', requestBody)
          
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          })
          
          if (!imageResponse.ok) {
            throw new Error(`Failed to generate image: ${imageResponse.statusText}`)
          }
          
          const imageData = await imageResponse.json()
          console.log('Image generation response:', imageData)
          
          // 更新生成的图片
          console.log('Updating menu item with generated image')
          setMenuItems(items =>
            items.map(item =>
              item.id === newItem.id
                ? {
                    ...item,
                    imageUrl: imageData.imageData,
                    format: imageData.format,
                    contentType: imageData.contentType,
                    isGenerating: false
                  }
                : item
            )
          )
          
          setUploadProgress((prev) => prev + (100 / acceptedFiles.length))
        } catch (error) {
          console.error('Error processing image:', error)
          console.error('Error details:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          })
          
          // 在错误时更新状态
          setMenuItems(items =>
            items.map(item =>
              item.id === newItem.id
                ? { ...item, isGenerating: false }
                : item
            )
          )
        }
      }
      await processFile(file)
    }
    
    setIsProcessing(false)
    setUploadProgress(0)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  })

  const handleRegenerate = async (itemId: string) => {
    console.log('Starting image regeneration for item:', itemId)
    const item = menuItems.find(item => item.id === itemId)
    if (!item) {
      console.error('Item not found:', itemId)
      return
    }

    setMenuItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, isGenerating: true } : item
      )
    )

    try {
      console.log('Sending regeneration request')
      const requestBody = {
        name: item.name,
        description: item.description
      }
      console.log('Regeneration request body:', requestBody)
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Failed to regenerate image: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Regeneration response:', data)

      setMenuItems(items =>
        items.map(item =>
          item.id === itemId
            ? {
                ...item,
                imageUrl: data.imageData,
                format: data.format,
                contentType: data.contentType,
                isGenerating: false
              }
            : item
        )
      )
    } catch (error) {
      console.error('Error regenerating image:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      
      setMenuItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, isGenerating: false } : item
        )
      )
    }
  }

  const handleDownload = async (imageUrl: string, name: string) => {
    console.log('Starting image download')
    console.log('Download parameters:', { imageUrl, name })
    
    try {
      // 如果是 base64 数据
      if (imageUrl.startsWith('data:')) {
        console.log('Handling base64 image download')
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `${name}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // 如果是普通 URL
        console.log('Handling URL image download')
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`)
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${name}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
      console.log('Download completed successfully')
    } catch (error) {
      console.error('Error downloading image:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/upload-icon.svg"
              alt="Upload"
              width={64}
              height={64}
            />
          </div>
          <h3 className="text-lg font-semibold">
            拖拽图片到这里，或点击上传
          </h3>
          <p className="text-sm text-gray-500">
            支持 JPG, PNG 格式的图片
          </p>
        </div>
      </Card>

      {isProcessing && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center text-gray-500">
            正在处理图片...
          </p>
        </div>
      )}

      <MenuList
        items={menuItems}
        onRegenerate={handleRegenerate}
        onDownload={handleDownload}
      />
    </div>
  )
}
