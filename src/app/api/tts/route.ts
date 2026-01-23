import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const ai = new GoogleGenAI({})

    const truncatedText = text.slice(0, 40000) // Rough character limit safety

    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash-preview-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: truncatedText }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Zephyr',
            },
          },
        },
      },
    })

    const candidate = response.candidates?.[0]
    const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData)

    if (audioPart?.inlineData?.data) {
      return NextResponse.json({ audioData: audioPart.inlineData.data })
    }

    // Try to get audio directly if it's a multimodal response
    if ((response as any).audio?.audio_content) {
      return NextResponse.json({ audioData: (response as any).audio.audio_content })
    }

    // If it returned text instead of audio, that's an issue
    if (response.text) {
      console.log('Gemini returned text instead of audio:', response.text)
      return NextResponse.json({ error: 'Model returned text instead of audio' }, { status: 500 })
    }

    // Fallback or error
    console.log('Gemini TTS response keys:', Object.keys(response))
    return NextResponse.json({ error: 'No audio data received' }, { status: 500 })
  } catch (error: any) {
    console.error('TTS error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
