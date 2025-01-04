import { NextResponse } from 'next/server'

export async function GET() {
  const openrouterKey = process.env.OPENROUTER_API_KEY
  const falKey = process.env.FAL_API_KEY

  const hasKeys = openrouterKey !== 'your_access_key_here' && 
                 falKey !== 'your_access_key_here' &&
                 openrouterKey && falKey

  return NextResponse.json({ hasKeys })
}
