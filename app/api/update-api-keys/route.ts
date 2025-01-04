import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { openrouterKey, falKey } = await req.json()

    if (!openrouterKey || !falKey) {
      return NextResponse.json(
        { error: 'Missing required API keys' },
        { status: 400 }
      )
    }

    // 读取当前的.env.local文件
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = await fs.readFile(envPath, 'utf-8')

    // 更新API密钥
    envContent = envContent.replace(
      /OPENROUTER_API_KEY=.*/,
      `OPENROUTER_API_KEY=${openrouterKey}`
    )
    envContent = envContent.replace(
      /FAL_API_KEY=.*/,
      `FAL_API_KEY=${falKey}`
    )

    // 写回文件
    await fs.writeFile(envPath, envContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating API keys:', error)
    return NextResponse.json(
      { error: 'Failed to update API keys' },
      { status: 500 }
    )
  }
}
