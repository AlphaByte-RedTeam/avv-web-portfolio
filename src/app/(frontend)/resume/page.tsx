import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { ResumeTemplate } from '@/components/ResumeTemplate'

export const metadata = {
  title: 'Resume | CV',
  description: 'Printable Resume',
}

export const dynamic = 'force-dynamic'

export default async function ResumePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch data from Payload (same as homepage but optimized for resume view)
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

  return (
    <ResumeTemplate 
        profile={profile}
        workExperience={workExperience}
        educations={educations}
        accomplishments={accomplishments}
        projects={projects}
        socialLinks={socialLinks}
        organizations={organizations}
        languages={languages}
        technologies={technologies}
    />
  )
}
