'use client'

import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
} from '@tabler/icons-react'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Code,
  Database,
  ExternalLink,
  Folder,
  Globe,
  GraduationCap,
  Languages as LanguagesIcon,
  Layers,
  Mail,
  MapPin,
  Phone,
  Trophy,
  User,
} from 'lucide-react'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { RichText } from '@/components/RichText'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
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
  blogPosts?: any[]
}

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 },
  },
}

export const CV: React.FC<Props> = ({
  profile,
  workExperience,
  educations,
  accomplishments,
  projects,
  socialLinks,
  organizations,
  languages,
  technologies = [],
  blogPosts = [],
}) => {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isHireMeOpen, setIsHireMeOpen] = useState(false)

  const programmingLanguages = technologies
    .filter((t) => t.category === 'programming_language')
    .slice(0, 5)
  const frameworks = technologies.filter((t) => t.category === 'framework')
  const databases = technologies.filter((t) => t.category === 'database')

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  const getYear = (dateString: string) => {
    if (!dateString) return 'Present'
    return new Date(dateString).getFullYear().toString()
  }

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase()
    if (p.includes('github')) return <IconBrandGithub className="h-3.5 w-3.5" />
    if (p.includes('linkedin')) return <IconBrandLinkedin className="h-3.5 w-3.5" />
    if (p.includes('instagram')) return <IconBrandInstagram className="h-3.5 w-3.5" />
    if (p.includes('tiktok')) return <IconBrandTiktok className="h-3.5 w-3.5" />
    if (p.includes('whatsapp')) return <Phone className="h-3.5 w-3.5" />
    if (p.includes('mail') || p.includes('email')) return <Mail className="h-3.5 w-3.5" />
    return <Globe className="h-3.5 w-3.5" />
  }

  const formatProficiency = (p: string) => {
    return p
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto py-20 px-6 sm:px-12 font-sans text-sm md:text-base leading-relaxed relative overflow-x-hidden"
    >
      {/* Absolute Theme Toggle & Actions */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2 z-10">
        <ThemeToggle />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog">Blog</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/resume" target="_blank">
            Download CV
          </Link>
        </Button>
        <Button variant="default" size="sm" onClick={() => setIsHireMeOpen(true)}>
          Hire Me!
        </Button>
      </div>

      {/* Hire Me Dialog */}
      <Dialog open={isHireMeOpen} onOpenChange={setIsHireMeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Let's work together!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button size="lg" variant="outline" className="w-full justify-between" asChild>
              <Link href="https://cal.com/avv210/15min" target="_blank">
                <span>Quick 15 min chat</span>
                <Phone className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full justify-between" asChild>
              <Link href="https://cal.com/avv210/30min" target="_blank">
                <span>Book a 30 min call</span>
                <Phone className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DialogFooter className="sm:justify-center">
            <p className="text-sm text-muted-foreground">
              Scheduled with{' '}
              <Link className="text-primary underline" href="https://cal.com/avv210">
                Cal.com
              </Link>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header / Hero Section */}
      <motion.header
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-24"
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          {profile?.profilePicture?.url ? (
            <div className="relative h-32 w-32 md:h-40 md:w-40 border border-border/50 shadow-sm rounded-full overflow-hidden shrink-0">
              <Image
                src={profile.profilePicture.url}
                alt={profile.name || 'Profile Picture'}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          ) : (
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border border-border/50 shadow-sm">
              <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground font-light">
                {profile?.name
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          )}
        </motion.div>

        <div className="flex-1 text-center md:text-left space-y-5 pt-2">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl tracking-tight text-foreground">
              {profile?.name || 'Your Name'}
            </h1>
            <p className="text-lg text-primary tracking-wide">
              {profile?.title || 'Professional Title'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs md:text-sm text-muted-foreground">
            {socialLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                {getSocialIcon(link.platform)}
                <span>{link.label || link.platform}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs md:text-sm text-muted-foreground">
            {profile?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT COLUMN (Main Content) - Spans 7 cols */}
        <div className="lg:col-span-7 space-y-20">
          {/* About Me */}
          {profile?.about && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <User className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">About</h2>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-loose text-[0.95rem]">
                <RichText content={profile.about} />
              </div>
            </motion.section>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-8">
                <Briefcase className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Experience
                </h2>
              </div>

              <div className="space-y-12">
                {workExperience.map((job) => (
                  <div key={job.id} className="relative group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                      <h3 className="text-lg text-foreground">{job.title}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatDate(job.startDate)} —{' '}
                        {job.endDate ? formatDate(job.endDate) : 'Present'}
                      </span>
                    </div>

                    <div className="text-primary text-sm mb-4 flex items-center gap-2">
                      {job.company}
                      {job.location && (
                        <span className="text-muted-foreground/60">• {job.location}</span>
                      )}
                      {job.jobType && (
                        <span className="text-xs text-muted-foreground/80 bg-secondary/50 px-2 py-0.5 rounded-full capitalize">
                          {job.jobType}
                        </span>
                      )}
                    </div>

                    <div className="text-muted-foreground text-sm leading-7">
                      <RichText content={job.description} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-8">
                <Folder className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Projects
                </h2>
              </div>

              <div className="space-y-12">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group space-y-4 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.coverImage && (
                      <div className="aspect-2/1 w-full overflow-hidden rounded-md bg-secondary/30 mb-4">
                        <Image
                          src={project.coverImage.url}
                          width={project.coverImage.width}
                          height={project.coverImage.height}
                          alt={project.title}
                          className="w-full h-full object-cover transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                        {project.repoUrl && (
                          <Button variant="outline" asChild onClick={(e) => e.stopPropagation()}>
                            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                              <IconBrandGithub className="h-4 w-4" />{' '}
                              <p className="hidden md:block">View Code</p>
                              <span className="sr-only">View Code</span>
                            </Link>
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Demo</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      <RichText content={project.description} />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.techStack?.map((tech: any, idx: number) => (
                        <span
                          key={`${idx}-${tech.id}`}
                          className="text-[10px] uppercase tracking-wider text-muted-foreground/80 border border-border px-2 py-1 rounded-sm"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* RIGHT COLUMN (Sidebar) - Spans 5 cols */}
        <div className="lg:col-span-5 space-y-16">
          {/* Education */}
          {educations.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <GraduationCap className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Education
                </h2>
              </div>

              <div className="space-y-8 border-l border-border/40 pl-6 ml-2">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative space-y-1.5">
                    <span className="absolute -left-[29px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 ring-4 ring-background" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base text-foreground">{edu.institution}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {getYear(edu.startDate)} — {edu.endDate ? getYear(edu.endDate) : 'Pres.'}
                      </span>
                    </div>
                    <div className="text-sm text-primary flex items-center justify-between">
                      <span>{edu.degree}</span>
                      {edu.gpa && (
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          GPA: {edu.gpa}
                        </Badge>
                      )}
                    </div>
                    {edu.description && (
                      <div className="text-xs text-muted-foreground pt-1 leading-relaxed">
                        <RichText content={edu.description} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Organizations */}
          {organizations && organizations.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Building2 className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Organizations
                </h2>
              </div>

              <div className="space-y-8 border-l border-border/40 pl-6 ml-2">
                {organizations.map((org) => (
                  <div key={org.id} className="relative space-y-1.5">
                    <span className="absolute -left-7.25 top-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 ring-4 ring-background" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base text-foreground">{org.organization}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {getYear(org.startDate)} — {org.endDate ? getYear(org.endDate) : 'Pres.'}
                      </span>
                    </div>
                    <div className="text-sm text-primary">{org.role}</div>
                    {org.website && (
                      <Link
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        Visit Website <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Accomplishments */}
          {accomplishments.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Trophy className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Recognition
                </h2>
              </div>

              <div className="grid gap-6">
                {accomplishments.map((acc) => {
                  const Content = () => (
                    <div className="group flex gap-4 items-start p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors h-full">
                      <div className="mt-1 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                        <Trophy className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                          {acc.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          <span>{acc.issuer}</span>
                          {acc.date && (
                            <>
                              <span className="opacity-50">•</span>
                              <span>{formatDate(acc.date)}</span>
                            </>
                          )}
                        </div>
                        <span className="inline-block text-[10px] text-primary/70 uppercase tracking-wider pt-1">
                          {acc.category}
                        </span>
                      </div>
                    </div>
                  )

                  return (
                    <React.Fragment key={acc.id}>
                      {acc.credentialUrl ? (
                        <Link
                          href={acc.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          <Content />
                        </Link>
                      ) : (
                        <Content />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </motion.section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <LanguagesIcon className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Languages
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    className="flex justify-between items-center p-3 rounded-md border border-border/40 bg-secondary/10"
                  >
                    <span className="text-sm text-foreground">{lang.language}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-normal uppercase tracking-tighter"
                    >
                      {formatProficiency(lang.proficiency)}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Programming Languages */}
          {programmingLanguages.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Code className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Most Used Languages
                </h2>
              </div>
              <div className="flex flex-col">
                {programmingLanguages.map((tech, index) => (
                  <React.Fragment key={tech.id}>
                    <div className="py-2 text-sm text-foreground">{tech.name}</div>
                    {index < programmingLanguages.length - 1 && (
                      <Separator className="bg-border/40" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.section>
          )}

          {/* Frameworks */}
          {frameworks.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Layers className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Most Used Frameworks
                </h2>
              </div>
              <div className="flex flex-col">
                {frameworks.map((tech, index) => (
                  <React.Fragment key={tech.id}>
                    <div className="py-2 text-sm text-foreground">{tech.name}</div>
                    {index < frameworks.length - 1 && <Separator className="bg-border/40" />}
                  </React.Fragment>
                ))}
              </div>
            </motion.section>
          )}

          {/* Databases */}
          {databases.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Database className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Most Used DB
                </h2>
              </div>
              <div className="flex flex-col">
                {databases.map((tech, index) => (
                  <React.Fragment key={tech.id}>
                    <div className="py-2 text-sm text-foreground">{tech.name}</div>
                    {index < databases.length - 1 && <Separator className="bg-border/40" />}
                  </React.Fragment>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* Project Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal lowercase tracking-tight mb-2">
              {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {selectedProject?.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-secondary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={selectedProject.coverImage.url}
                  width={selectedProject.coverImage.width}
                  height={selectedProject.coverImage.height}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {selectedProject?.techStack?.map((tech: any, idx: number) => (
                  <span
                    key={`${idx}-${tech.id}`}
                    className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded-sm"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <RichText content={selectedProject?.description} />
              </div>

              {selectedProject?.gallery?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {selectedProject.gallery.map((item: any, idx: number) => (
                    <div
                      key={`${idx}-${item.id}`}
                      className="aspect-video relative rounded-md overflow-hidden border border-border/50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image
                        src={item.image.url}
                        width={item.image.width}
                        height={item.image.height}
                        alt={`${selectedProject.title} gallery ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Project Links at Bottom */}
              <div className="flex gap-4 pt-6 border-t border-border/40">
                {selectedProject?.repoUrl && (
                  <Button variant="outline" size="sm" className="h-9 gap-2 px-6" asChild>
                    <Link href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer">
                      <IconBrandGithub className="h-4 w-4" />{' '}
                      <p className="hidden md:block">View Code</p>
                      <span className="sr-only">View Code</span>
                    </Link>
                  </Button>
                )}
                {selectedProject?.demoUrl && (
                  <Button variant="default" size="sm" className="h-9 gap-2 px-6" asChild>
                    <Link href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Latest Thoughts */}
      {blogPosts.length > 0 && (
        <motion.section variants={itemVariants} className="mt-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light tracking-tight text-foreground">Latest Thoughts</h2>
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/blog">
                View all posts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-secondary/20 rounded-lg p-6 h-full transition-colors hover:bg-secondary/40 flex flex-col border border-transparent hover:border-border/50">
                  <div className="text-xs text-muted-foreground mb-3 font-mono">
                    {formatDate(post.date)}
                  </div>
                  <h3 className="text-lg font-medium leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1 mb-4">
                    {post.description || richTextToPlainText(post.content).substring(0, 150)}
                  </p>
                  <div className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      <motion.footer
        variants={itemVariants}
        className="mt-32 pt-8 border-t border-border/40 text-center space-y-2"
      >
        <p className="text-xs text-muted-foreground/60 tracking-wide">
          © {new Date().getFullYear()} {profile?.name} • Built with love.
        </p>
      </motion.footer>
    </motion.div>
  )
}
