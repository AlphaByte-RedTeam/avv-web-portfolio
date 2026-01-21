'use client'

import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, ExternalLink, Copy, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'

interface Media {
  id: string
  url?: string | null
  alt: string
}

interface Referral {
  id: string
  name: string
  code?: string | null
  idCode?: string | null
  link: string
  description?: string | null
  image?: Media | string | null
}

export const MicrolinkClient = ({ referrals }: { referrals: Referral[] }) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredReferrals = useMemo(() => {
    if (!debouncedSearch) return referrals
    const lowerSearch = debouncedSearch.toLowerCase()
    return referrals.filter(ref =>
      ref.name.toLowerCase().includes(lowerSearch) ||
      (ref.code && ref.code.toLowerCase().includes(lowerSearch)) ||
      (ref.idCode && ref.idCode.includes(lowerSearch))
    )
  }, [debouncedSearch, referrals])

  const copyCode = (code: string, id: string) => {
      navigator.clipboard.writeText(code)
      setCopiedId(id)
      toast.success('Code copied to clipboard')
      setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto space-y-8 px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 text-center items-center"
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Referral Links</h1>
        <p className="text-muted-foreground max-w-[700px] mx-auto">
          Explore my curated list of tools and services. Use the search to find specific referrals or codes.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md mx-auto w-full"
      >
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or code..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredReferrals.map((item, index) => {
            const imageUrl = typeof item.image === 'object' && item.image?.url ? item.image.url : null
            const altText = typeof item.image === 'object' && item.image?.alt ? item.image.alt : item.name

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 w-full bg-muted/50 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-4xl font-bold text-muted-foreground opacity-20">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-xl line-clamp-1" title={item.name}>{item.name}</CardTitle>
                        {item.code && (
                             <Badge variant="secondary" className="font-mono text-xs shrink-0 cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => copyCode(item.code!, item.id)}>
                                {item.code}
                                {copiedId === item.id ? <Check className="ml-1 h-3 w-3" /> : <Copy className="ml-1 h-3 w-3" />}
                             </Badge>
                        )}
                    </div>
                    {item.description && <CardDescription className="line-clamp-2 min-h-[40px]">{item.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="mt-auto pt-0 pb-4">
                     <Button asChild className="w-full" variant="default">
                        <Link href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            Visit Site <ExternalLink className="h-4 w-4" />
                        </Link>
                     </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

       {filteredReferrals.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20 text-muted-foreground"
        >
          No referrals found matching "{debouncedSearch}"
        </motion.div>
      )}
    </div>
  )
}
