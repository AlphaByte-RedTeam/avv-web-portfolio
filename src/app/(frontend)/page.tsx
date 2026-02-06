import crypto from 'node:crypto'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import { AutoRefresh } from '@/components/AutoRefresh'
import { CommandMenu } from '@/components/CommandMenu'
import { CV } from '@/components/CV'
import { richTextToPlainText } from '@/lib/utils'
import config from '@/payload.config'
import './globals.css'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch data from Payload
  const [
    profileData,
    workExperienceData,
    educationsData,
    accomplishmentsData,
    projectsData,
    socialLinksData,
    organizationsData,
    languagesData,
    technologiesData,
    blogPostsData,
    activitiesData,
    testScoresData,
    totalBlogViewsData,
    allBlogPostsData,
  ] = await Promise.all([
    payload.find({
      collection: 'profile',
      limit: 1,
    }),
    payload.find({
      collection: 'work-experience',
      sort: '-startDate',
    }),
    payload.find({
      collection: 'educations',
      sort: '-startDate',
    }),
    payload.find({
      collection: 'accomplishments',
      sort: '-date',
    }),
    payload.find({
      collection: 'projects',
      sort: '-date',
    }),
    payload.find({
      collection: 'social-links',
    }),
    payload.find({
      collection: 'organizations',
      sort: '-startDate',
    }),
    payload.find({
      collection: 'languages',
    }),
    payload.find({
      collection: 'technologies',
      sort: '-priority',
      limit: 100,
    }),
    payload.find({
      collection: 'blog',
      sort: '-date',
      limit: 3,
    }),
    payload.find({
      collection: 'activity',
      sort: '-date',
      limit: 6,
    }),
    payload.find({
      collection: 'test-scores',
      sort: '-date',
    }),
    payload.count({
      collection: 'blog-views',
    }),
    payload.find({
      collection: 'blog',
      pagination: false,
      select: {
        content: true,
      },
    }),
  ])

  const totalBlogViews = totalBlogViewsData.totalDocs

  // Calculate total words written
  let totalWordsWritten = 0
  allBlogPostsData.docs.forEach((post) => {
    const text = richTextToPlainText(post.content)
    const words = text.trim().split(/\s+/).length
    totalWordsWritten += words
  })

  // Visitor tracking logic
  const today = new Date().toISOString().split('T')[0]
  let visitorCount = 0
  let totalVisitors = 0
  let globalReach = 0
  let mobilePercentage = 0

  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const country = headersList.get('x-vercel-ip-country') || 'Unknown'
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent)
    const deviceType = isMobile ? 'mobile' : 'desktop'

    const hash = crypto.createHash('sha256').update(`${ip}-${userAgent}-${today}`).digest('hex')

    const existing = await payload.find({
      collection: 'visitors',
      where: {
        and: [{ hash: { equals: hash } }, { date: { equals: today } }],
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'visitors',
        data: {
          hash,
          date: today,
          country,
          deviceType,
        },
      })
    }

    const [todayCount, totalCount, allVisitors] = await Promise.all([
      payload.count({
        collection: 'visitors',
        where: { date: { equals: today } },
      }),
      payload.count({
        collection: 'visitors',
      }),
      payload.find({
        collection: 'visitors',
        limit: 10000, // Fetch for aggregation
        pagination: false,
      }),
    ])

    visitorCount = todayCount.totalDocs
    totalVisitors = totalCount.totalDocs

    // Aggregate Global Reach (Unique Countries)
    const countries = new Set(
      allVisitors.docs.map((d: any) => d.country).filter((c: string) => c && c !== 'Unknown'),
    )
    globalReach = countries.size

    // Aggregate Device Usage (Mobile Percentage)
    const mobileUsers = allVisitors.docs.filter((d: any) => d.deviceType === 'mobile').length
    mobilePercentage = totalVisitors > 0 ? Math.round((mobileUsers / totalVisitors) * 100) : 0
  } catch (error) {
    console.error('Error tracking visitors:', error)
  }

  const profile = profileData.docs[0] || null
  const workExperience = workExperienceData.docs
  const educations = educationsData.docs
  const accomplishments = accomplishmentsData.docs
  const projects = projectsData.docs
  const socialLinks = socialLinksData.docs
  const organizations = organizationsData.docs
  const languages = languagesData.docs
  const technologies = technologiesData.docs
  const blogPosts = blogPostsData.docs

  // Fetch views for blog posts and find trending
  let trendingPost: { title: string; views: number } | null = null
  let maxViews = 0

  const blogPostsWithViews = await Promise.all(
    blogPosts.map(async (post) => {
      const views = await payload.count({
        collection: 'blog-views',
        where: {
          blogSlug: { equals: post.slug },
        },
      })

      if (views.totalDocs > maxViews) {
        maxViews = views.totalDocs
        trendingPost = { title: post.title, views: views.totalDocs }
      }

      return {
        ...post,
        views: views.totalDocs,
      }
    }),
  )

  // Fallback: If no views in latest 3, check all posts?
  // For now, let's stick to the fetched blog posts to avoid extra heavy queries,
  // or we can do a quick separate aggregation if needed.
  // Actually, to find the REAL trending post, we should query blog-views more intelligently.
  // But Payload doesn't support "groupBy" easily in the API yet without raw DB access.
  // So for MVP, let's assume the "Trending" is among the recent posts or just stick to the highest of the fetched ones.
  // OR: We iterate over *all* blogs if the count isn't huge.
  // Let's stick to the 'latest' posts for now to keep it fast, or maybe fetch top 10 recent blogs.

  // A better approach for "Trending" is actually to look at `blog-views` but we need to know WHICH slug has most.
  // Without direct SQL, we'd have to fetch all views or all blogs.
  // Let's refine: We will check the `blogPosts` we already fetched (latest 3).
  // If we want a global trending, we'd need a separate robust query.
  // Let's add a small separate query for "all time popular" if we want, or just use the current subset.

  // Let's try to fetch a few more blogs just to check for a "hot" one if the main 3 aren't it.
  if (!trendingPost && blogPostsWithViews.length > 0) {
    // If we have posts but all have 0 views, just pick the first one or none.
    if (maxViews > 0) {
      // trendingPost is already set
    }
  }

  const activities = activitiesData.docs
  const testScores = testScoresData.docs

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name,
    jobTitle: profile?.title,
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://avv-portfolio.vercel.app',
    image:
      profile?.profilePicture &&
      typeof profile.profilePicture === 'object' &&
      profile.profilePicture.url
        ? profile.profilePicture.url
        : undefined,
    sameAs: socialLinks.map((link) => link.url),
    description: profile?.about
      ? (profile.about as any).root?.children?.[0]?.children?.[0]?.text
      : undefined,
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[500px] -translate-y-1/2 opacity-[0.15]"
        style={{
          background: `radial-gradient(circle at center, #ADFF00 0%, transparent 70%)`,
          filter: 'blur(120px)',
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AutoRefresh intervalMs={5000} />
      <CommandMenu socialLinks={socialLinks} />
      <CV
        profile={profile}
        workExperience={workExperience}
        educations={educations}
        accomplishments={accomplishments}
        projects={projects}
        socialLinks={socialLinks}
        organizations={organizations}
        languages={languages}
        technologies={technologies}
        blogPosts={blogPostsWithViews}
        activities={activities}
        testScores={testScores}
        visitorCount={visitorCount}
        totalVisitors={totalVisitors}
        globalReach={globalReach}
        mobilePercentage={mobilePercentage}
        trendingPost={trendingPost}
        totalBlogViews={totalBlogViews}
        totalWordsWritten={totalWordsWritten}
      />
    </div>
  )
}
