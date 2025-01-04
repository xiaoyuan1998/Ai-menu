import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

// 创建 OpenRouter 客户端
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "AI-Menu-Generator",
    "Content-Type": "application/json"
  }
})

// 定义菜品的 schema
const DishSchema = z.object({
  dishes: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string()
  }))
})

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(req: Request) {
  console.log('Starting image analysis')
  try {
    console.log('Reading form data')
    const formData = await req.formData()
    const image = formData.get('image') as File

    if (!image) {
      console.log('Error: No image provided')
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    console.log('Image info:', {
      name: image.name,
      type: image.type,
      size: image.size
    })

    const imageBuffer = await image.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
  
    const requestData = {
      model: "anthropic/claude-3.5-sonnet-20240620",
      messages: [
        {
          role: 'system' as const,
          content: '这是一个饭店的菜单。请提取菜单中的菜品名称，并以JSON格式返回结果。返回格式必须是: {"dishes": [{"name": "菜品名称", "type": "菜品类型", "description": "描述"}]}。确保返回的是有效的JSON格式并且使用用菜单中的语言。'
        },
        {
          role: 'user' as const,
          content: [
            { 
              type: 'text' as const, 
              text: '请分析这张图片中的所有菜品，列出它们的名称、类型和描述。必须返回JSON格式。用菜单中的语言' 
            },
            { 
              type: 'image_url' as const, 
              image_url: { 
                url: `data:${image.type || 'image/jpeg'};base64,${base64Image}`
              } 
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }

    let lastError = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`API request attempt ${attempt}/${MAX_RETRIES}`)
        console.log('Request data:', JSON.stringify(requestData, null, 2))
        
        const response = await openrouter.chat.completions.create({
          ...requestData,
          stream: false
        })

        // 打印原始响应信息
        console.log('Complete API Response:', JSON.stringify(response, null, 2))
        
        if (!response.choices || response.choices.length === 0) {
          throw new Error('No response choices available')
        }

        const result = response.choices[0].message.content
        if (!result) {
          throw new Error('No content in response')
        }

        try {
          // 提取 JSON 字符串
          console.log('Extracting JSON from response')
          const jsonMatch = result.match(/\{[\s\S]*\}/)
          if (!jsonMatch) {
            console.error('No JSON pattern found in content')
            throw new Error('No JSON found in response')
          }
          
          // 解析 JSON
          console.log('Parsing JSON')
          const parsedContent = JSON.parse(jsonMatch[0])
          console.log('Parsed content:', parsedContent)
          
          // 验证数据结构
          console.log('Validating data structure')
          const validatedData = DishSchema.parse(parsedContent)
          console.log('Validation successful')
          
          return NextResponse.json(validatedData)
        } catch (e) {
          console.error('Failed to parse or validate JSON response:', e)
          console.error('Content that failed to parse:', result)
          throw e
        }
      } catch (error) {
        lastError = error
        console.error(`Attempt ${attempt} failed:`, error)
        
        if (attempt < MAX_RETRIES) {
          console.log(`Waiting ${RETRY_DELAY}ms before next attempt...`)
          await delay(RETRY_DELAY)
        }
      }
    }

    throw lastError
  } catch (error: any) {
    console.error('Error analyzing image:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze image',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
