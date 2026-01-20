'use client'

import React, { useEffect } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { richTextToPlainText } from '@/lib/utils'

type Props = {
  profile: any
  workExperience: any[]
  educations: any[]
  accomplishments: any[]
  projects: any[]
  socialLinks: any[]
  organizations: any[]
  languages: any[]
  technologies: any[]
}

export const ResumeTemplate: React.FC<Props> = ({
  profile,
  workExperience,
  educations,
  languages,
  technologies,
  socialLinks,
}) => {
  useEffect(() => {
    const date = new Date().toISOString().split('T')[0]
    document.title = `CV-Andrew-Virya-Victorio-${date}`
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 p-4 md:p-8 flex flex-col items-center print:block print:bg-white print:p-0">
      {/* Controls */}
      <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-semibold">ATS Resume Preview</h1>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      {/* A4 Paper */}
      <div
        className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-[25.4mm] shadow-lg print:shadow-none print:w-full print:max-w-none print:p-0 print:m-0"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          color: '#000000',
        }}
      >
        {/* HEADER GRID */}
        <div className="grid grid-cols-[2fr_1fr] gap-8 mb-10">
          {/* Left: Name, Title, About */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{profile?.name}</h1>
            <h2 className="text-xl font-bold mb-4">{profile?.title}</h2>
            {profile?.about && (
              <div className="text-sm leading-relaxed text-justify">
                 {richTextToPlainText(profile.about)}
              </div>
            )}
          </div>

          {/* Right: Contact Info */}
          <div className="text-right text-sm space-y-1 pt-2">
            {profile?.location && <div>{profile.location}</div>}
            {/* Phone placeholder if not in profile, or extracted */}
            {socialLinks.map((link) => (
              <div key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-black decoration-black underline-offset-2"
                >
                  {link.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* WORK EXPERIENCE */}
        {workExperience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold border-b-2 border-black pb-1 mb-6">
              Work Experience
            </h3>
            <div className="space-y-6">
              {workExperience.map((job) => (
                <div key={job.id} className="grid grid-cols-[180px_1fr] gap-6">
                  {/* Left: Date & Location */}
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      {formatDate(job.startDate)} -{' '}
                      {job.endDate ? formatDate(job.endDate) : 'Present'}
                    </div>
                    <div>{job.location}</div>
                  </div>

                  {/* Right: Content */}
                  <div>
                    <h4 className="text-lg font-bold">{job.title}</h4>
                    <div className="text-lg font-bold mb-2">{job.company}</div>
                    <div className="text-sm leading-relaxed text-gray-800">
                      <div className="list-disc pl-0 space-y-1">
                        {richTextToPlainText(job.description)
                          .split('\n')
                          .filter(line => line.trim())
                          .map((line, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span>•</span>
                              <span>{line.trim()}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {educations.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold border-b-2 border-black pb-1 mb-6">
              Education
            </h3>
            <div className="space-y-6">
              {educations.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[180px_1fr] gap-6">
                  {/* Left: Date */}
                  <div className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} -{' '}
                    {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>

                  {/* Right: Content */}
                  <div>
                    <h4 className="text-lg font-bold">{edu.institution}</h4>
                    <div className="text-md font-bold text-gray-800 flex justify-between">
                      <span>{edu.degree}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                    {edu.description && (
                       <div className="text-sm mt-1 text-gray-700">
                          <div className="list-disc pl-0 space-y-1">
                            {richTextToPlainText(edu.description)
                              .split('\n')
                              .filter(line => line.trim())
                              .map((line, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <span>•</span>
                                  <span>{line.trim()}</span>
                                </div>
                              ))}
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS & LANGUAGES GRID */}
        <div className="grid grid-cols-2 gap-12">
          {/* Skills */}
          {technologies.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold border-b-2 border-black pb-1 mb-4">
                Skills
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {technologies.map((tech) => (
                  <li key={tech.id} className="text-gray-800">
                    {tech.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold border-b-2 border-black pb-1 mb-4">
                Languages
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {languages.map((lang) => (
                  <li key={lang.id} className="text-gray-800">
                    <span className="font-semibold">{lang.language}</span>
                    {lang.proficiency && (
                        <span className="text-gray-600"> — {lang.proficiency.replace('_', ' ')}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 25.4mm; /* Standard 1 inch margin for ALL pages */
            size: A4;
          }
          body {
            background: white;
            -webkit-print-color-adjust: exact;
          }
          /* Ensure the container doesn't add extra padding on top of @page margin */
          .print\:p-0 {
            padding: 0 !important;
          }
          .print\:m-0 {
            margin: 0 !important;
          }
          /* Ensure grid works in print */
          .grid {
            display: grid;
          }
        }
      `}</style>
    </div>
  )
}
