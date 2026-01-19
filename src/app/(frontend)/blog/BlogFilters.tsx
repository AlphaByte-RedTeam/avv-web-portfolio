'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Technology', value: 'technology' },
  { label: 'Personal', value: 'personal' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Review', value: 'review' },
  { label: 'Other', value: 'other' },
]

export function BlogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialSearch = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'

  const [search, setSearch] = useState(initialSearch)
  const debouncedSearch = useDebounce(search, 500)
  
  // Use a separate state for the controlled select value to avoid synchronization issues
  const [category, setCategory] = useState(initialCategory)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearch) {
      params.set('q', debouncedSearch)
    } else {
      params.delete('q')
    }

    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    router.push(`/blog?${params.toString()}`)
  }, [debouncedSearch, category, router, searchParams])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
