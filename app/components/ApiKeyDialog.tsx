'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Settings } from 'lucide-react'

export function ApiKeyDialog({ triggerButton = false }) {
  const [open, setOpen] = useState(false)
  const [openrouterKey, setOpenrouterKey] = useState('')
  const [falKey, setFalKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 在组件挂载时直接打开对话框
  useEffect(() => {
    if (!triggerButton) {
      setOpen(true)
    }
  }, [triggerButton])

  const handleSubmit = async () => {
    if (!openrouterKey || !falKey) {
      alert('请填写所有必需的API密钥')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/update-api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openrouterKey: openrouterKey,
          falKey: falKey,
        }),
      })

      if (!response.ok) {
        throw new Error('更新API密钥失败')
      }

      setOpen(false)
      // 刷新页面以加载新的API密钥
      window.location.reload()
    } catch (error) {
      console.error('保存API密钥时出错:', error)
      alert('保存API密钥时出错，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>设置API密钥</DialogTitle>
        <DialogDescription>
          请输入您的OpenRouter和FAL.AI API密钥以继续使用应用
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="openrouter">OpenRouter API密钥</Label>
          <Input
            id="openrouter"
            value={openrouterKey}
            onChange={(e) => setOpenrouterKey(e.target.value)}
            placeholder="sk-or-v1-..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fal">FAL.AI API密钥</Label>
          <Input
            id="fal"
            value={falKey}
            onChange={(e) => setFalKey(e.target.value)}
            placeholder="输入您的FAL.AI API密钥"
          />
        </div>
      </div>
      <Button 
        onClick={handleSubmit} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? '保存中...' : '保存'}
      </Button>
    </DialogContent>
  )

  // 如果是按钮触发模式，返回带有触发器的对话框
  if (triggerButton) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  // 否则返回自动打开的对话框
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogContent}
    </Dialog>
  )
}
