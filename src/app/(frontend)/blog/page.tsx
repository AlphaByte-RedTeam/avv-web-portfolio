import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AutoRefresh } from '@/components/AutoRefresh'

export default async function BlogPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const blogData = await payload.find({
    collection: 'blog',
    sort: '-date',
  })

  const posts = blogData.docs

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 font-sans">
        <AutoRefresh intervalMs={5000} />
      {/* Absolute Theme Toggle */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts, tutorials, and insights on software development and design.
          </p>
        </header>

        {/* Blog Grid */}
        <div className="grid gap-10 md:grid-cols-2">
            {posts.length === 0 ? (
                <p className="text-muted-foreground">No posts found.</p>
            ) : (
                posts.map((post) => (
                    <Link 
                        key={post.id} 
                        href={`/blog/${post.slug}`}
                        className="group block space-y-4"
                    >
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-secondary/30">
                        {post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url ? (
                        <Image
                            src={post.coverImage.url}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground">
                            No Image
                        </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            {post.category && (
                                <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
                                    {post.category}
                                </Badge>
                            )}
                        </div>
                        <h2 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                        </h2>
                    </div>
                    </Link>
                ))
            )}
        </div>
      </div>
    </div>
  )
}
