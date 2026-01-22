"use client"

import * as React from "react"
import {
  Home,
  FileText,
  Image as ImageIcon,
  Briefcase,
  Mail,
  Sun,
  Moon,
  Laptop,
  Link2,
  Terminal
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface CommandMenuProps {
  socialLinks: any[]
}

export function CommandMenu({ socialLinks }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const copyEmail = () => {
    const emailLink = socialLinks.find((link) => 
      link.platform.toLowerCase().includes('mail') || 
      link.platform.toLowerCase().includes('email')
    )
    
    if (emailLink) {
      // Extract email from mailto: if present, otherwise assume it's the url or label
      let email = emailLink.url.replace('mailto:', '')
      if (!email && emailLink.label.includes('@')) {
        email = emailLink.label
      }
      
      if (email) {
        navigator.clipboard.writeText(email)
        toast.success("Email copied to clipboard!", {
          description: email,
        })
      } else {
          toast.error("Could not find email address.")
      }
    } else {
        toast.error("No email address found in profile.")
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 md:hidden print:hidden">
        {/* Mobile trigger could go here if needed, but we rely on BottomNav/Gestures usually */}
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/blog'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Blog</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/activity'))}>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Activity</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => window.open('/resume', '_blank'))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Resume</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/microlink'))}>
              <Link2 className="mr-2 h-4 w-4" />
              <span>Microlinks</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/prompts'))}>
              <Terminal className="mr-2 h-4 w-4" />
              <span>Prompts</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runCommand(() => copyEmail())}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Copy Email</span>
              <CommandShortcut>⌘E</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
