'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { usePreferences } from './PreferencesProvider'

export const LikeButton = ({ slug }: { slug: string }) => {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { playClickSound } = usePreferences()

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes?slug=${slug}`)
        if (res.ok) {
          const data = await res.json()
          setLikes(data.likes)
          setHasLiked(data.hasLiked)
        }
      } catch (error) {
        console.error('Failed to fetch likes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLikes()
  }, [slug])

  const handleLike = async () => {
    // Determine action: Unlike if currently liked, Like otherwise
    const isUnliking = hasLiked
    const method = isUnliking ? 'DELETE' : 'POST'
    
    // Optimistic update
    setLikes(prev => isUnliking ? prev - 1 : prev + 1)
    setHasLiked(!isUnliking)
    
    playClickSound()

    try {
      const res = await fetch('/api/likes', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      
      if (!res.ok) {
        // Revert if failed
        setLikes(prev => isUnliking ? prev + 1 : prev - 1)
        setHasLiked(isUnliking)
        toast.error(isUnliking ? 'Failed to unlike post' : 'Failed to like post')
      }
    } catch (error) {
      // Revert if error
      setLikes(prev => isUnliking ? prev + 1 : prev - 1)
      setHasLiked(isUnliking)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 transition-all duration-300",
        hasLiked && "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/10"
      )}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
      <span>{likes}</span>
    </Button>
  )
}
