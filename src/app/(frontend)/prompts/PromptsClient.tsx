'use client'

import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, Copy, Check, Terminal } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'

interface Prompt {
  id: string
  title: string
  description?: string | null
  content: string
  tags?: { tag?: string | null; id?: string | null }[] | null
}

export const PromptsClient = ({ prompts }: { prompts: Prompt[] }) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredPrompts = useMemo(() => {
    if (!debouncedSearch) return prompts
    const lowerSearch = debouncedSearch.toLowerCase()
    return prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(lowerSearch) ||
        (prompt.description && prompt.description.toLowerCase().includes(lowerSearch)) ||
        (prompt.tags && prompt.tags.some((t) => t.tag?.toLowerCase().includes(lowerSearch))),
    )
  }, [debouncedSearch, prompts])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Prompt copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto space-y-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 text-center items-center"
      >
        <h1 className="text-3xl tracking-tighter sm:text-4xl md:text-5xl">Prompts Library</h1>
        <p className="text-muted-foreground max-w-175 mx-auto">
          A collection of useful prompts for AI models. Click to view and copy.
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
          placeholder="Search prompts or tags..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50 group">
                    <CardHeader>
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                        {prompt.title}
                      </CardTitle>
                      {prompt.description && (
                        <CardDescription className="line-clamp-2">
                          {prompt.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="bg-muted/30 p-3 rounded-md text-xs font-mono text-muted-foreground line-clamp-3 overflow-hidden relative">
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-muted/10 pointer-events-none" />
                        {prompt.content}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 flex-wrap pt-0">
                      {prompt.tags?.map(
                        (t, i) =>
                          t.tag && (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-5"
                            >
                              {t.tag}
                            </Badge>
                          ),
                      )}
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>{prompt.title}</DialogTitle>
                    <DialogDescription>{prompt.description}</DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="flex-1 bg-muted/30 rounded-md border p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                      {prompt.content}
                    </pre>
                  </ScrollArea>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => copyToClipboard(prompt.content, prompt.id)}
                      className="w-full sm:w-auto gap-2"
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check className="h-4 w-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPrompts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-muted-foreground"
        >
          No prompts found matching "{debouncedSearch}"
        </motion.div>
      )}
    </div>
  )
}
