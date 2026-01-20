import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export function richTextToPlainText(content: any): string {
  if (!content?.root?.children) return ''

  return content.root.children
    .map((node: any) => {
      if (node.type === 'text') {
        return node.text
      }
      if (node.children) {
        return node.children.map((child: any) => child.text || '').join(' ')
      }
      return ''
    })
    .join('\n')
}
