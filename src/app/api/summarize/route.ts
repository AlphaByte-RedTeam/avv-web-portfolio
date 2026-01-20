import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const ai = new GoogleGenAI({})
    const prompt = `
      Please summarize the following blog post content concisely in 2-3 paragraphs.
      Focus on the main ideas and key takeaways. Use bullet points with hyphens symbols to highlight the main points.
      Only show what the main ideas and key takeaways. Translate the content based on content language if possible.
      Do not use any formatting or special characters. Do not use external links or references.
      Focus only on the blog content.

    Content:
    ${content}`

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    })
    const summary = response.text

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
