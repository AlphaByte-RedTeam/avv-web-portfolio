'use client'

import { useRouter } from 'next/navigation'
import type React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  currentLocale: 'en' | 'id'
  currentSlug: string
  alternateSlug?: string
}

export const LanguageSwitcher: React.FC<Props> = ({
  currentLocale,
  currentSlug,
  alternateSlug,
}) => {
  const router = useRouter()

  const handleValueChange = (value: string) => {
    if (value === currentLocale) return

    if (value !== currentLocale && alternateSlug) {
      router.push(`/blog/${alternateSlug}`)
    }
  }

  return (
    <Select value={currentLocale} onValueChange={handleValueChange}>
      <SelectTrigger className="w-auto h-9">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <span className="flex items-center gap-2">🇺🇸 EN</span>
        </SelectItem>
        {alternateSlug || currentLocale === 'id' ? (
          <SelectItem value="id">
            <span className="flex items-center gap-2">🇮🇩 ID</span>
          </SelectItem>
        ) : null}
      </SelectContent>
    </Select>
  )
}
