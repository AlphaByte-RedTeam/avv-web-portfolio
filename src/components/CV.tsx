'use client'

import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandThreads,
  IconBrandTiktok,
  IconEye,
} from '@tabler/icons-react'
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChartBar,
  ClipboardCheck,
  Code,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  Folder,
  Globe,
  GraduationCap,
  History,
  Languages as LanguagesIcon,
  Layers,
  LayoutList,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Terminal,
  Trophy,
  User,
} from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GithubCalendar } from '@/components/GithubCalendar'
import { NowWidget } from '@/components/NowWidget'
import { RichText } from '@/components/RichText'
import { type TimelineItem, TimelineView } from '@/components/TimelineView'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn, richTextToPlainText } from '@/lib/utils'

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
  activities?: any[]
  testScores?: any[]
  visitorCount?: number
  totalVisitors?: number
  globalReach?: number
  mobilePercentage?: number
  trendingPost?: { title: string; views: number } | null
  totalBlogViews?: number
  totalWordsWritten?: number
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
  activities = [],
  testScores = [],
  visitorCount = 0,
  totalVisitors = 0,
  globalReach = 0,
  mobilePercentage = 0,
  trendingPost = null,
  totalBlogViews = 0,
  totalWordsWritten = 0,
}) => {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedTestScore, setSelectedTestScore] = useState<any>(null)
  const [isHireMeOpen, setIsHireMeOpen] = useState(false)
  const [timeString, setTimeString] = useState('')
  const [greeting, setGreeting] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      const offset = -now.getTimezoneOffset() / 60
      const gmtStr = `GMT${offset >= 0 ? '+' : ''}${offset}`

      setTimeString(`${gmtStr} ${timeStr}`)

      const hour = now.getHours()
      if (hour < 12) setGreeting('Good Morning')
      else if (hour < 18) setGreeting('Good Afternoon')
      else setGreeting('Good Evening')
    }
    updateTime()
    const interval = setInterval(updateTime, 1000 * 60)
    return () => clearInterval(interval)
  }, [])

  const programmingLanguages = technologies
    .filter((t) => t.category === 'programming_language')
    .slice(0, 5)
  const frameworks = technologies.filter((t) => t.category === 'framework')
  const databases = technologies.filter((t) => t.category === 'database')
  const devtools = technologies.filter((t) => t.category === 'devtools')

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
    if (p.includes('threads')) return <IconBrandThreads className="h-3.5 w-3.5" />
    if (p.includes('mail') || p.includes('email')) return <Mail className="h-3.5 w-3.5" />
    return <Globe className="h-3.5 w-3.5" />
  }

  const calculateReadingTime = (content: any) => {
    const text = richTextToPlainText(content)
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    const time = Math.ceil(words / wordsPerMinute)
    return `${time} min read`
  }

  const handleSocialClick = (e: React.MouseEvent, link: any) => {
    const platform = link.platform.toLowerCase()
    if (platform.includes('mail') || platform.includes('email')) {
      e.preventDefault()
      // Extract email from mailto: if present, otherwise assume it's the url or label
      let email = link.url.replace('mailto:', '')
      if (!email && link.label.includes('@')) {
        email = link.label
      }

      if (email) {
        navigator.clipboard.writeText(email)
        toast.success('Email copied to clipboard!', {
          description: email,
        })
      } else {
        // Fallback if extraction fails but it is a mail link
        window.open(link.url, '_blank')
      }
    }
  }

  const formatProficiency = (p: string) => {
    return p
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const githubLink = socialLinks.find((link) => link.platform.toLowerCase().includes('github'))
  const githubUsername = githubLink ? githubLink.url.replace(/\/$/, '').split('/').pop() : undefined
  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME || 'avv210'

  // Normalize data for Timeline
  const timelineItems: TimelineItem[] = [
    ...workExperience.map((item) => ({
      id: item.id,
      type: 'work' as const,
      title: item.title,
      subtitle: item.company,
      date: item.startDate,
      endDate: item.endDate,
      description: item.description,
    })),
    ...educations.map((item) => ({
      id: item.id,
      type: 'education' as const,
      title: item.institution,
      subtitle: item.degree,
      date: item.startDate,
      endDate: item.endDate,
    })),
    ...projects.map((item) => ({
      id: item.id,
      type: 'project' as const,
      title: item.title,
      date: item.date,
      description: item.description,
      tags: item.techStack?.map((t: any) => t.name),
    })),
    ...accomplishments.map((item) => ({
      id: item.id,
      type: 'accomplishment' as const,
      title: item.title,
      subtitle: item.issuer,
      date: item.date,
    })),
  ].sort((a, b) => {
    // Sort by date descending (newest first)
    // Handle 'Present' or missing dates logic if needed, but ISO strings sort well.
    // If date is missing, treat as oldest?
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto py-20 px-6 sm:px-12 font-sans text-sm md:text-base leading-relaxed relative overflow-x-hidden"
    >
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2 z-50 print:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}
          title={viewMode === 'list' ? 'Switch to Timeline View' : 'Switch to List View'}
        >
          {viewMode === 'list' ? (
            <History className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <LayoutList className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
        <ThemeToggle />
      </div>

      {/* Hire Me Dialog */}
      <Dialog open={isHireMeOpen} onOpenChange={setIsHireMeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Let&apos;s work together!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button size="lg" variant="outline" className="w-full justify-between" asChild>
              <Link href={`https://cal.com/${calUsername}/15min`} target="_blank">
                <span>Quick 15 min chat</span>
                <Phone className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full justify-between" asChild>
              <Link href={`https://cal.com/${calUsername}/30min`} target="_blank">
                <span>Book a 30 min call</span>
                <Phone className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DialogFooter className="sm:justify-center">
            <p className="text-sm text-muted-foreground">
              Scheduled with{' '}
              <Link className="text-primary underline" href={`https://cal.com/${calUsername}`}>
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
            <div className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              {greeting}, I&apos;m
            </div>
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
                onClick={(e) => handleSocialClick(e, link)}
                className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                {getSocialIcon(link.platform)}
                <span>{link.label || link.platform}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs md:text-sm text-muted-foreground items-center">
            {profile?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
            {timeString && (
              <>
                <span className="text-border">•</span>
                <span>{timeString}</span>
              </>
            )}
            {profile?.isHireable && (
              <div className="flex items-center gap-1.5 ml-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-medium border border-green-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span>Open to Work</span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Timeline View */}
      <div className={cn(viewMode === 'list' && 'hidden')}>
        <TimelineView items={timelineItems} />
      </div>

      {/* List View */}
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-16',
          viewMode === 'timeline' && 'hidden',
        )}
      >
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
              <div className="flex items-center gap-3 text-primary mb-2">
                <Folder className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Projects
                </h2>
              </div>

              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {projects.map((project) => (
                    <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                      <div
                        id={project.slug}
                        className="group space-y-4 cursor-pointer h-full flex flex-col"
                        onClick={() => setSelectedProject(project)}
                      >
                        {project.coverImage && (
                          <div className="aspect-2/1 w-full overflow-hidden rounded-md bg-secondary/30 relative">
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
                          <h3 className="text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <div className="flex gap-2 shrink-0">
                            {project.repoUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <IconBrandGithub className="h-4 w-4" />
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
                                <Link
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">Demo</span>
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                          <RichText content={project.description} />
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.techStack?.slice(0, 4).map((tech: any, idx: number) => (
                            <span
                              key={`${idx}-${tech.id}`}
                              className="text-[10px] uppercase tracking-wider text-muted-foreground/80 border border-border px-2 py-1 rounded-sm"
                            >
                              {tech.name}
                            </span>
                          ))}
                          {project.techStack?.length > 4 && (
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 border border-border px-2 py-1 rounded-sm">
                              +{project.techStack.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="static translate-y-0 h-8 w-8" />
                  <CarouselNext className="static translate-y-0 h-8 w-8" />
                </div>
              </Carousel>
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
                    <span className="absolute -left-7.25 top-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 ring-4 ring-background" />
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

          {/* Test Scores */}
          {testScores.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <ClipboardCheck className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Test Score
                </h2>
              </div>

              <div className="grid gap-6">
                {testScores.map((score) => {
                  return (
                    <div
                      key={score.id}
                      onClick={() => setSelectedTestScore(score)}
                      className="group flex gap-4 items-start p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                    >
                      <div className="mt-1 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                        <ClipboardCheck className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1.5 w-full">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                              {score.title}
                            </h4>
                            <Eye className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-medium shrink-0 ml-2"
                          >
                            {score.score}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          {score.associatedWith && <span>{score.associatedWith}</span>}
                          {score.date && (
                            <>
                              {score.associatedWith && <span className="opacity-50">•</span>}
                              <span>{formatDate(score.date)}</span>
                            </>
                          )}
                        </div>

                        {score.description && (
                          <div className="text-xs text-muted-foreground pt-1 leading-relaxed line-clamp-2">
                            <RichText content={score.description} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
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

          {/* Dev Tools */}
          {devtools.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Terminal className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Dev Tools
                </h2>
              </div>
              <div className="flex flex-col">
                {devtools.map((tech, index) => (
                  <React.Fragment key={tech.id}>
                    <div className="py-2 text-sm text-foreground flex items-center justify-between group">
                      <span>{tech.name}</span>
                      {tech.tool_url && (
                        <Link
                          href={tech.tool_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                    {index < devtools.length - 1 && <Separator className="bg-border/40" />}
                  </React.Fragment>
                ))}
              </div>
            </motion.section>
          )}

          {/* Now / Current Status Widget */}
          <div className="pt-4">
            <NowWidget
              status={profile?.currentStatus}
              project={profile?.currentProject}
              learning={profile?.currentLearning}
            />
          </div>

          {/* Github Calendar */}
          <div className="pt-4">
            <GithubCalendar username={githubUsername} />
          </div>

          {/* Web Metrics */}
          {visitorCount > 0 && (
            <motion.section variants={itemVariants} className="space-y-6 pt-4">
              <div className="flex items-center gap-3 text-primary mb-6">
                <ChartBar className="h-4 w-4" />
                <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
                  Web Metrics
                </h2>
              </div>
              <div className="flex flex-col gap-2 border-l border-border/40 pl-6 ml-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>
                    U&apos;re the{' '}
                    <span className="font-mono font-medium text-foreground">{visitorCount}</span>{' '}
                    visitors today!
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary/40 shrink-0"></span>
                  <span>
                    Total visitors:{' '}
                    <span className="font-mono font-medium text-foreground">{totalVisitors}</span>
                  </span>
                </div>
                {globalReach > 0 && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>
                      Global Reach:{' '}
                      <span className="font-medium text-foreground">{globalReach} Countries</span>
                    </span>
                  </div>
                )}
                {totalVisitors > 0 && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Smartphone className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                    <span>
                      Device Usage:{' '}
                      <span className="font-medium text-foreground">
                        {mobilePercentage}% Mobile
                      </span>
                    </span>
                  </div>
                )}
                {trendingPost && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span>
                      Trending:{' '}
                      <span className="font-medium text-foreground">{trendingPost.title}</span>{' '}
                      <span className="text-xs opacity-70">({trendingPost.views} views)</span>
                    </span>
                  </div>
                )}
                {totalBlogViews > 0 && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Eye className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                    <span>
                      Total Content Views:{' '}
                      <span className="font-mono font-medium text-foreground">
                        {totalBlogViews}
                      </span>
                    </span>
                  </div>
                )}
                {totalWordsWritten > 0 && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                    <span>
                      Words Written:{' '}
                      <span className="font-mono font-medium text-foreground">
                        {totalWordsWritten.toLocaleString()}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* Project Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal tracking-tight mb-2">
              {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {selectedProject?.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-secondary/20">
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

      {/* Test Score Dialog */}
      <Dialog open={!!selectedTestScore} onOpenChange={() => setSelectedTestScore(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal tracking-tight flex items-center justify-between gap-4">
              <span>{selectedTestScore?.title}</span>
              {selectedTestScore?.score && (
                <Badge variant="secondary" className="text-sm font-medium">
                  {selectedTestScore.score}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {selectedTestScore?.associatedWith && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Associated with:</span>
                  <span>{selectedTestScore.associatedWith}</span>
                </div>
              )}
              {selectedTestScore?.date && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Date:</span>
                  <span>{formatDate(selectedTestScore.date)}</span>
                </div>
              )}
            </div>

            {selectedTestScore?.description && (
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
                <RichText content={selectedTestScore.description} />
              </div>
            )}

            {selectedTestScore?.documents?.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Documents & Certificates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTestScore.documents.map((doc: any, idx: number) => {
                    // Determine file url and type
                    const fileUrl = doc.file?.url || doc.externalUrl
                    const fileName = doc.title || doc.file?.filename || 'Document'
                    const isImage = doc.file?.mimeType?.startsWith('image/')
                    const fileSize = doc.file?.filesize
                      ? `${(doc.file.filesize / 1024).toFixed(0)} KB`
                      : ''

                    if (!fileUrl) return null

                    return (
                      <div
                        key={idx}
                        className="group relative flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="shrink-0 h-10 w-10 rounded-md bg-background flex items-center justify-center text-primary/50 border border-border/50">
                              {isImage ? (
                                <Image
                                  src={fileUrl}
                                  alt={fileName}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              ) : (
                                <FileText className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-medium truncate text-foreground/90 group-hover:text-primary transition-colors">
                                {fileName}
                              </span>
                              {fileSize && (
                                <span className="text-[10px] text-muted-foreground">
                                  {fileSize}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs flex-1 gap-1.5"
                            asChild
                          >
                            <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-3 w-3" /> View
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs flex-1 gap-1.5"
                            asChild
                          >
                            <Link href={fileUrl} download target="_blank" rel="noopener noreferrer">
                              <Download className="h-3 w-3" /> Download
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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
                  <div className="text-xs text-muted-foreground mb-3 font-mono flex items-center justify-between">
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-3">
                      <span>{calculateReadingTime(post.content)}</span>
                      {post.views > 0 && (
                        <span className="flex items-center gap-1">
                          <IconEye className="h-3 w-3" />
                          {post.views}
                        </span>
                      )}
                    </span>
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

      {/* Activity Gallery Preview */}
      {activities.length > 0 && (
        <motion.section variants={itemVariants} className="mt-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light tracking-tight text-foreground">Activity Gallery</h2>
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/activity">
                View gallery <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {activities.slice(0, 6).map((activity) => (
              <Link
                key={activity.id}
                href="/activity"
                className="group relative aspect-square overflow-hidden rounded-md bg-secondary/20"
              >
                <Image
                  src={activity.image.url}
                  alt={activity.image.alt || 'Activity'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  )
}
