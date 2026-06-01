// app/api/translate/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = await request.json()

    // Using Google Translate API
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        })
      }
    )

    if (!response.ok) {
      throw new Error('Google Translate API failed')
    }

    const data = await response.json()
    const translatedText = data.data.translations[0].translatedText

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}