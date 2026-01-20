import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { AutoRefresh } from '@/components/AutoRefresh'
import { RichText } from '@/components/RichText'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { PageActions } from '@/components/PageActions'
import config from '@/payload.config'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'blog',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = docs[0]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description || post.title,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'blog',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = docs[0]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 font-sans">
      <AutoRefresh intervalMs={5000} />
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2">
        <PageActions title={post.title} text={post.description || undefined} />
        <ThemeToggle />
      </div>

      <article className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-6 text-center">
          <div className="flex justify-start">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </div>

          <div className="space-y-4 pt-4">
            {post.category && (
              <Badge variant="secondary" className="uppercase tracking-wider">
                {post.category}
              </Badge>
            )}
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
              <span>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {post.lastUpdated && new Date(post.lastUpdated) > new Date(post.date) && (
                <span className="text-xs opacity-70 italic">
                  Last updated: {new Date(post.lastUpdated).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>

          {post.description && (
            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto italic">
              {post.description}
            </p>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose text-muted-foreground">
          <RichText content={post.content} />
        </div>
      </article>
    </div>
  )
}
