import { IconEye } from '@tabler/icons-react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import { AutoRefresh } from '@/components/AutoRefresh'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { calculateReadingTime, richTextToPlainText } from '@/lib/utils'
import config from '@/payload.config'
import { BlogFilters } from './BlogFilters'

type Props = {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { q, category } = await searchParams
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const query: any = {
    and: [],
  }

  if (q) {
    query.and.push({
      title: {
        like: q,
      },
    })
  }

  if (category && category !== 'all') {
    query.and.push({
      category: {
        equals: category,
      },
    })
  }

  const blogData = await payload.find({
    collection: 'blog',
    sort: '-date',
    where: query.and.length > 0 ? query : undefined,
  })

  const posts = await Promise.all(
    blogData.docs.map(async (post) => {
      const views = await payload.count({
        collection: 'blog-views',
        where: {
          blogSlug: { equals: post.slug },
        },
      })
      return {
        ...post,
        views: views.totalDocs,
      }
    })
  )

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 font-sans">
      <AutoRefresh intervalMs={5000} />
      {/* Absolute Theme Toggle */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                Blog
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Thoughts, tutorials, and insights.
              </p>
            </div>
          </div>
          <BlogFilters />
        </header>

        {/* Blog Grid */}
        <div className="grid gap-10 md:grid-cols-2">
          {posts.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground bg-secondary/10 rounded-lg">
              <p>No posts found matching your criteria.</p>
            </div>
          ) : (
            posts.map((post) => {
              const plainText = richTextToPlainText(post.content)
              const readingTime = calculateReadingTime(plainText)

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span>{readingTime} min read</span>
                          {(post.views as number) > 0 && (
                            <span className="flex items-center gap-1">
                              <IconEye className="h-3 w-3" />
                              {post.views as number}
                            </span>
                          )}
                        </div>
                        {post.category && (
                          <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                      {post.lastUpdated && new Date(post.lastUpdated) > new Date(post.date) && (
                        <span className="text-[10px] opacity-70">
                          Updated:{' '}
                          {new Date(post.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
