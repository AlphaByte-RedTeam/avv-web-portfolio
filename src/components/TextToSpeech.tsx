'use client'

import { Pause, Play, Square, Volume2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  title: string
  summary?: string
  content: string
  aiSummary?: string // Optional, if we can ever pass it
}

export const TextToSpeech: React.FC<Props> = ({ title, summary, content }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handlePlay = () => {
    if (isPaused && utterance) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      setIsPlaying(false)
      return
    }

    const textToRead = [
      `Title: ${title}`,
      summary ? `Summary: ${summary}` : '',
      `Content: ${content}`,
    ]
      .filter(Boolean)
      .join('. \n\n ')

    const newUtterance = new SpeechSynthesisUtterance(textToRead)
    
    // Select a pleasant voice if available
    const voices = window.speechSynthesis.getVoices()
    // Prefer Google US English or similar natural voices
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') && v.name.includes('English') && v.name.includes('US')) ||
      (v.name.includes('Samantha') && v.lang.includes('en')) ||
      v.lang === 'en-US'
    )
    
    if (preferredVoice) {
      newUtterance.voice = preferredVoice
    }

    newUtterance.rate = 0.9 // Slightly slower for better comprehension
    newUtterance.pitch = 1

    newUtterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setUtterance(null)
    }

    newUtterance.onerror = (e) => {
      console.error('Speech synthesis error:', e)
      setIsPlaying(false)
      setIsPaused(false)
      setUtterance(null)
    }

    setUtterance(newUtterance)
    window.speechSynthesis.speak(newUtterance)
    setIsPlaying(true)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setUtterance(null)
  }

  // Ensure SSR doesn't break
  if (typeof window === 'undefined') return null
  if (!('speechSynthesis' in window)) return null

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
              onClick={handlePlay}
            >
              {isPlaying ? (
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
            <p>Read article aloud</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {(isPlaying || isPaused) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                onClick={handleStop}
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
