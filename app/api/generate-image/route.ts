import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { fal } from "@fal-ai/client"
import { getPrompt } from '@/lib/prompts'

// 创建 OpenRouter 客户端用于生成描述
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "AI-Menu-Generator"
  }
})

// 配置 FAL.AI 客户端
fal.config({
  credentials: process.env.FAL_API_KEY
});

async function generateImageWithFalAi(prompt: string) {
  console.log('Generating image with prompt:', prompt)
  
  try {
    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt: prompt,
        negative_prompt: "blurry, bad quality, distorted, deformed",
        num_inference_steps: 50,
        guidance_scale: 7.5,
        image_size: {
          width: 1024,
          height: 1024
        }
      },
      pollInterval: 1000, // 每秒检查一次结果
      logs: true, // 启用日志
    })

    console.log('Fal.AI API response:', JSON.stringify(result, null, 2))

    return {
      images: [{
        url: result.data.images[0].url,
        seed: result.data.seed,
        mimeType: result.data.images[0].content_type || 'image/jpeg'
      }],
      model: 'fast-sdxl',
      prompt: prompt
    }
  } catch (error: any) {
    console.error('Error in image generation:', error)

    // 检查是否是余额不足错误
    if (error?.body?.detail?.includes('Exhausted balance')) {
      throw new Error('Image generation service is temporarily unavailable due to API limits. Please try again later.')
    }

    // 其他错误
    throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`)
  }
}

export async function POST(req: Request) {
  console.log('Starting POST request processing')
  const startTime = Date.now()
  
  try {
    console.log('Reading request body')
    const { name, language = 'en-us' } = await req.json()
    console.log('Request body:', { name, language })

    if (!name) {
      console.log('Error: No dish name provided')
      return NextResponse.json({ error: 'No dish name provided' }, { status: 400 })
    }

    const prompts = getPrompt(language)

    console.log('Step 1: Generating description for:', name)
    const descriptionResponse = await openrouter.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: prompts.system
        },
        {
          role: 'user',
          content: prompts.user(name)
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    console.log('Step 2: Processing description response')
    console.log('Description response:', JSON.stringify(descriptionResponse, null, 2))
    const imageDescription = descriptionResponse.choices?.[0]?.message?.content || ''
    
    // 清理描述文本，移除任何markdown格式和额外的对话内容
    const cleanDescription = imageDescription
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除markdown图片
      .replace(/```.*?```/gs, '') // 移除代码块
      .replace(/\[.*?\]/g, '') // 移除方括号内容
      .replace(/https?:\/\/\S+/g, '') // 移除URL
      .replace(/\n+/g, ' ') // 将多个换行替换为空格
      .trim()

    // 添加通用的摄影参数
    const finalPrompt = `A professional food photograph of ${cleanDescription}. Shot with a high-end DSLR camera, using natural lighting, shallow depth of field (f/2.8), and styled for a luxury restaurant menu. 8K resolution, hyperrealistic details, professional food photography composition.`

    console.log('Step 3: Creating final prompt')
    console.log('Final prompt:', finalPrompt)

    console.log('Step 4: Generating image')
    const imageResult = await generateImageWithFalAi(finalPrompt)
    console.log('Image generation result:', JSON.stringify(imageResult, null, 2))

    console.log('Step 5: Preparing response')
    console.log('Time elapsed:', Date.now() - startTime, 'ms')

    // 创建响应对象，直接使用 Fal.AI URL
    const responseData = { 
      ...imageResult,
      imageUrl: imageResult.images[0].url, // 直接使用 Fal.AI 返回的 URL
      model: "flux-pro-v1.1-ultra",
      generationTime: Date.now() - startTime
    }
    console.log('Final response data:', JSON.stringify(responseData, null, 2))

    // 使用 NextResponse.json() 创建响应
    const response = NextResponse.json(responseData)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('Step 6: Sending response')
    return response

  } catch (error: any) {
    console.error('Error in request processing:', error)
    console.error('Error stack:', error.stack)
    console.log('Time elapsed before error:', Date.now() - startTime, 'ms')
    
    // 准备错误消息
    let errorMessage = 'Error in image generation process'
    let statusCode = 500

    if (error.message.includes('API limits')) {
      errorMessage = error.message
      statusCode = 503  // Service Unavailable
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }, { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
