import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { CV } from '@/components/CV'
import { AutoRefresh } from '@/components/AutoRefresh'
import { CommandMenu } from '@/components/CommandMenu'
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
  ])

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
        blogPosts={blogPosts}
        activities={activities}
        testScores={testScores}
      />
    </div>
  )
}