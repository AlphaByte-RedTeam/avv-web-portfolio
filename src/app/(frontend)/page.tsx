import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { CV } from '@/components/CV'
import { AutoRefresh } from '@/components/AutoRefresh'
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AutoRefresh intervalMs={5000} />
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
      />
    </div>
  )
}