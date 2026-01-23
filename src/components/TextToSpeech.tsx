'use client'

import { Loader2, Pause, Play, Square, Volume2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Props = {
  title: string
  summary?: string
  content: string
  aiSummary?: string
}

export const TextToSpeech: React.FC<Props> = ({ title, summary, content }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Chunking state
  const [chunks, setChunks] = useState<string[]>([])

  // Refs for managing playback without re-renders
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCache = useRef<Map<number, string>>(new Map()) // Index -> Blob URL
  const isFetchingRef = useRef<Set<number>>(new Set()) // Track active fetches
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopPlayback()
    }
  }, [])

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    // Revoke all blob URLs to free memory
    audioCache.current.forEach((url) => URL.revokeObjectURL(url))
    audioCache.current.clear()
    isFetchingRef.current.clear()

    setIsPlaying(false)
    setIsPaused(false)
    setIsLoading(false)
    setChunks([])
  }

  // Helper to add WAV header to raw PCM data
  const writeWavHeader = (samples: Uint8Array, sampleRate = 24000) => {
    const buffer = new ArrayBuffer(44 + samples.length)
    const view = new DataView(buffer)

    // RIFF identifier
    writeString(view, 0, 'RIFF')
    // file length
    view.setUint32(4, 36 + samples.length, true)
    // RIFF type
    writeString(view, 8, 'WAVE')
    // format chunk identifier
    writeString(view, 12, 'fmt ')
    // format chunk length
    view.setUint32(16, 16, true)
    // sample format (raw)
    view.setUint16(20, 1, true)
    // channel count
    view.setUint16(22, 1, true)
    // sample rate
    view.setUint32(24, sampleRate, true)
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true)
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true)
    // bits per sample
    view.setUint16(34, 16, true)
    // data chunk identifier
    writeString(view, 36, 'data')
    // data chunk length
    view.setUint32(40, samples.length, true)

    // write the PCM samples
    const pcmView = new Uint8Array(buffer, 44)
    pcmView.set(samples)

    return buffer
  }

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  const fetchAudioForChunk = async (
    text: string,
    index: number,
    signal: AbortSignal,
  ): Promise<string | null> => {
    if (audioCache.current.has(index)) return audioCache.current.get(index)!
    if (isFetchingRef.current.has(index)) return null // Already fetching

    isFetchingRef.current.add(index)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal,
      })

      if (!response.ok) throw new Error('Failed to generate speech')

      const data = await response.json()
      if (!data.audioData) throw new Error('No audio data')

      const binaryString = window.atob(data.audioData)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Add WAV header (Gemini output is typically 24kHz mono PCM)
      const wavBuffer = writeWavHeader(bytes, 24000)

      const blob = new Blob([wavBuffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)

      audioCache.current.set(index, url)
      isFetchingRef.current.delete(index)
      return url
    } catch (error: any) {
      isFetchingRef.current.delete(index)
      if (error.name !== 'AbortError') {
        console.error(`Error fetching chunk ${index}:`, error)
      }
      return null
    }
  }

  const playChunk = async (index: number, chunksOverride?: string[]) => {
    const activeChunks = chunksOverride || chunks

    if (index >= activeChunks.length) {
      stopPlayback()
      return
    }

    // Check cache first
    let url = audioCache.current.get(index)

    // If not in cache, we need to wait for it (it should have been pre-fetched, but if not...)
    if (!url) {
      setIsLoading(true)
      if (!abortControllerRef.current) abortControllerRef.current = new AbortController()
      url =
        (await fetchAudioForChunk(activeChunks[index], index, abortControllerRef.current.signal)) ||
        undefined
      setIsLoading(false)
    }

    if (!url) {
      // Failed to get audio for this chunk, skip to next
      playChunk(index + 1, activeChunks)
      return
    }

    const audio = new Audio(url)
    audioRef.current = audio

    audio.onended = () => {
      playChunk(index + 1, activeChunks)
    }

    audio.onerror = (e) => {
      console.error('Playback error', e)
      playChunk(index + 1, activeChunks)
    }

    try {
      await audio.play()
      setIsPlaying(true)

      // Pre-fetch next 2 chunks
      if (abortControllerRef.current) {
        const signal = abortControllerRef.current.signal
        if (index + 1 < activeChunks.length)
          fetchAudioForChunk(activeChunks[index + 1], index + 1, signal)
        if (index + 2 < activeChunks.length)
          fetchAudioForChunk(activeChunks[index + 2], index + 2, signal)
      }
    } catch (err) {
      console.error('Play failed', err)
      setIsPlaying(false)
    }
  }

  // Chunking utility
  const splitTextIntoChunks = (text: string, maxChars = 250): string[] => {
    // 1. Split by double newlines first (paragraphs)
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)

    const chunks: string[] = []

    for (const paragraph of paragraphs) {
      if (paragraph.length <= maxChars) {
        chunks.push(paragraph)
      } else {
        // 2. If paragraph is too long, split by sentences
        // Match sentence endings (.!?) followed by space or end of string
        const sentences = paragraph.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || [paragraph]

        let currentChunk = ''

        for (const sentence of sentences) {
          if ((currentChunk + sentence).length <= maxChars) {
            currentChunk += (currentChunk ? ' ' : '') + sentence
          } else {
            if (currentChunk) chunks.push(currentChunk)
            currentChunk = sentence
          }
        }
        if (currentChunk) chunks.push(currentChunk)
      }
    }
    return chunks
  }

  const handlePlay = async () => {
    // Resume if paused
    if (isPaused && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      setIsPaused(false)
      return
    }

    // Prepare content if starting fresh
    if (!isPlaying && chunks.length === 0) {
      setIsLoading(true)
      abortControllerRef.current = new AbortController()

      // Clean content
      const cleanContent = content.replace(/[#*`_~]/g, '')

      // Construct the text flow
      const intro = `Title: ${title}. ${summary ? `Summary: ${summary}.` : ''}`

      // Generate chunks
      // Intro chunk is critical for immediate feedback, keep it separate and small
      const introChunks = splitTextIntoChunks(intro, 200)
      const contentChunks = splitTextIntoChunks(cleanContent, 300) // Slightly larger for body

      const allChunks = [...introChunks, ...contentChunks]

      setChunks(allChunks)

      // Fetch first chunk immediately
      if (allChunks.length > 0) {
        try {
          // Note: fetchAudioForChunk uses index, so it caches based on index.
          // playChunk relies on 'chunks' state for length check.
          // Since setState is async, we should pass the chunks explicitly or ensure state is ready?
          // Actually, playChunk uses 'chunks' from closure if defined inside component?
          // No, it uses 'chunks' from state which might be stale in this same render cycle!

          // Fix: Modify playChunk to accept optional chunks array override

          const url = await fetchAudioForChunk(allChunks[0], 0, abortControllerRef.current.signal)
          if (!url) throw new Error('Initial fetch failed')

          setIsLoading(false)
          // Pass the fresh chunks array to avoid stale state issues
          playChunk(0, allChunks)
        } catch (error: any) {
          console.error('Initial Playback Failed:', error)
          setIsLoading(false)
          toast.error('Failed to start playback', {
            description: error.message || 'Please check your connection or API key.',
          })
          stopPlayback()
        }
      } else {
        setIsLoading(false)
        toast.error('No content to read')
      }
      return
    }

    // Resume logic for chunk system if needed (usually handled by audioRef check above)
    // If we have chunks but audioRef is null (e.g. stopped externally?), restart
    if (chunks.length > 0 && !audioRef.current) {
      playChunk(0)
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsPaused(true)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 text-xs transition-colors ${
                isPlaying ? 'border-primary text-primary bg-primary/5' : ''
              }`}
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {chunks.length > 0 ? 'Buffering...' : 'Starting...'}
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </>
              ) : isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Resume
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  Listen
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Read article aloud with AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {(isPlaying || isPaused || isLoading) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                onClick={stopPlayback}
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span className="sr-only">Stop</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop reading</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
