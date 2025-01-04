import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

// 创建 OpenRouter 客户端
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "AI-Menu-Generator"
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
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: '这是一个饭店的菜单。请提取菜单中的菜品名称，并以JSON格式返回结果。返回格式必须是: {"dishes": [{"name": "菜品名称", "type": "菜品类型", "description": "描述"}]}。确保返回的是有效的JSON格式。'
        },
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: '请分析这张图片中的所有菜品，列出它们的名称、类型和描述。必须返回JSON格式。' 
            },
            { 
              type: 'image_url', 
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
          stream: false,
          headers: {
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'AI-Menu-Generator'
          }
        })

        // 打印原始响应信息
        console.log('Complete API Response:', JSON.stringify(response, null, 2))
        
        if (response.error) {
          console.error('API returned error:', response.error)
          throw new Error(`API error: ${response.error.message || 'Unknown error'}`)
        }
        
        console.log('API Response:', {
          status: response.choices?.length ? 'has choices' : 'no choices',
          model: response.model,
          usage: response.usage,
          object: response.object,
          created: response.created
        })

        if (!response.choices || response.choices.length === 0) {
          console.error('API Error Response:', {
            status: 'no choices',
            statusText: 'No choices in response',
            error: 'No choices in response'
          })
          throw new Error('No choices in response')
        }

        const content = response.choices[0].message?.content
        if (!content) {
          console.error('API Error Response:', {
            status: 'no content',
            statusText: 'No content in response',
            error: 'No content in response'
          })
          throw new Error('No content in response')
        }

        console.log('Raw response content:', content)

        try {
          // 提取 JSON 字符串
          console.log('Extracting JSON from response')
          const jsonMatch = content.match(/\{[\s\S]*\}/)
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
          console.error('Content that failed to parse:', content)
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
