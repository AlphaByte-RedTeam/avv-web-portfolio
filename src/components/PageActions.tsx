'use client'

import { Check, Copy, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  title?: string
  text?: string
}

export const PageActions: React.FC<Props> = ({ title, text }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          text: text || 'Check this out',
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={handleCopyLink}
        title="Copy Link"
      >
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={handleShare}
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </>
  )
}
