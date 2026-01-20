import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { AutoRefresh } from '@/components/AutoRefresh'
import { PageActions } from '@/components/PageActions'
import { RichText } from '@/components/RichText'
import { SummarizeButton } from '@/components/SummarizeButton'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { calculateReadingTime, richTextToPlainText } from '@/lib/utils'
import config from '@/payload.config'

import { LanguageSwitcher } from './LanguageSwitcher'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let post: any = null
  let locale: 'en' | 'id' = 'en'

  // Try EN
  const { docs: docsEn } = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'en',
  })

  if (docsEn.length > 0) {
    post = docsEn[0]
    locale = 'en'
  } else {
    // Try ID
    const { docs: docsId } = await payload.find({
      collection: 'blog',
      where: { slug: { equals: slug } },
      limit: 1,
      locale: 'id',
    })
    if (docsId.length > 0) {
      post = docsId[0]
      locale = 'id'
    }
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Fetch author info from profile
  const { docs: profileDocs } = await payload.find({
    collection: 'profile',
    limit: 1,
  })
  const authorName = profileDocs[0]?.name || 'Portfolio Owner'

  return {
    title: post.title,
    description: post.description || `Read ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.description || `Read ${post.title}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastUpdated,
      authors: [authorName],
      section: post.category || 'Technology',
      url: `/blog/${post.slug}`,
      locale: locale === 'en' ? 'en_US' : 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `Read ${post.title}`,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let post: any = null
  let locale: 'en' | 'id' = 'en'

  // Try EN
  const { docs: docsEn } = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'en',
  })

  if (docsEn.length > 0) {
    post = docsEn[0]
    locale = 'en'
  } else {
    // Try ID
    const { docs: docsId } = await payload.find({
      collection: 'blog',
      where: { slug: { equals: slug } },
      limit: 1,
      locale: 'id',
    })
    if (docsId.length > 0) {
      post = docsId[0]
      locale = 'id'
    }
  }

  if (!post) {
    notFound()
  }

  // Fetch all locales to get alternate slug
  const docAllLocales = await payload.findByID({
    collection: 'blog',
    id: post.id,
    locale: 'all',
  })

  const alternateLocale = locale === 'en' ? 'id' : 'en'
  // @ts-expect-error
  const alternateSlug = docAllLocales.slug?.[alternateLocale]

  const plainTextContent = richTextToPlainText(post.content)
  const readingTime = calculateReadingTime(plainTextContent)

  // Fetch Recommended Posts
  const { docs: recommendedPosts } = await payload.find({
    collection: 'blog',
    where: {
      and: [
        {
          category: {
            equals: post.category,
          },
        },
        {
          id: {
            not_equals: post.id,
          },
        },
      ],
    },
    limit: 3,
    sort: '-date',
    locale,
  })

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 font-sans">
      <AutoRefresh intervalMs={5000} />
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2">
        <LanguageSwitcher
          currentLocale={locale}
          currentSlug={slug}
          alternateSlug={alternateSlug}
        />
        <SummarizeButton content={plainTextContent} />
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
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 opacity-70" />
                <span className="font-medium text-foreground/80">Published:</span>
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {post.lastUpdated && (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground/80">Last Updated:</span>
                  <span className="italic">
                    {new Date(post.lastUpdated).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 opacity-70" />
                <span>{readingTime} min read</span>
              </div>
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

      {/* Recommended Posts Section */}
      {recommendedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-32 pt-16 border-t border-border/40">
          <h2 className="text-2xl font-semibold mb-8 text-center">More in {post.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedPosts.map((recPost) => {
              const recPlainText = richTextToPlainText(recPost.content)
              const recReadingTime = calculateReadingTime(recPlainText)

              return (
                <Link key={recPost.id} href={`/blog/${recPost.slug}`} className="group block">
                  <div className="bg-secondary/20 rounded-lg p-6 h-full transition-colors hover:bg-secondary/40 flex flex-col">
                    <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      <span>
                        {new Date(recPost.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span>{recReadingTime} min read</span>
                    </div>
                    <h3 className="text-lg font-medium leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {recPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                      {recPost.description}
                    </p>
                    <div className="mt-4 text-xs font-medium text-primary flex items-center gap-1">
                      Read article <ArrowLeft className="h-3 w-3 rotate-180" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
