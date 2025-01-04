import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

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

interface MenuListProps {
  items: MenuItem[]
  onRegenerate: (id: string) => void
  onDownload: (imageUrl: string, name: string) => void
}

export default function MenuList({ items, onRegenerate, onDownload }: MenuListProps) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({})
  const imageUrlsRef = useRef<{ [key: string]: string }>({})
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set())

  // 调试用：监视 items 变化
  useEffect(() => {
    items.forEach(item => {
      console.log(`Item ${item.id} status:`, {
        name: item.name,
        hasUrl: !!item.imageUrl,
        url: item.imageUrl,
        isGenerating: item.isGenerating,
        isLoaded: loadedItems.has(item.id),
        cachedUrl: imageUrls[item.id]
      })
    })
  }, [items, loadedItems, imageUrls])

  // 处理图片 URL
  const getImageUrl = (item: MenuItem) => {
    console.log('Getting image URL for item:', {
      id: item.id,
      url: item.imageUrl,
      isGenerating: item.isGenerating,
      isLoaded: loadedItems.has(item.id)
    })
    
    if (!item.imageUrl) {
      console.log('No image URL available')
      return null
    }

    return item.imageUrl // 直接返回 URL，因为已经是相对路径
  }

  // 图片加载完成的处理
  const handleImageLoad = (item: MenuItem) => {
    console.log('Image loaded successfully:', item.id)
    if (!loadedItems.has(item.id)) {
      setLoadedItems(prev => new Set([...prev, item.id]))
    }
  }

  // 图片加载错误处理
  const handleImageError = (item: MenuItem) => {
    console.error('Image load failed for:', item.id)
    // 从已加载集合中移除
    setLoadedItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(item.id)
      return newSet
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            {item.imageUrl && !item.isGenerating ? (
              <>
                <img
                  key={item.imageUrl}
                  src={getImageUrl(item) || '/dishes/placeholder.jpg'}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => handleImageError(item)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onRegenerate(item.id)}
                      className="bg-white hover:bg-gray-100"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      重新生成
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDownload(item.imageUrl!, item.name)}
                      className="bg-white hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  {item.isGenerating ? (
                    <>
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">AI 正在生成图片...</p>
                    </>
                  ) : (
                    <Button
                      onClick={() => onRegenerate(item.id)}
                      className="bg-white hover:bg-gray-100"
                    >
                      立即生成图片
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg">{item.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
