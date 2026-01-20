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
  if (!content) return ''
  
  // If it's a root object with children, start recursion
  if (content.root && content.root.children) {
    return content.root.children.map((child: any) => richTextToPlainText(child)).join('\n')
  }

  // Recursive step for generic nodes with children
  if (content.children) {
    // If it's a list, join items with newline
    if (content.type === 'list') {
       return content.children.map((child: any) => richTextToPlainText(child)).join('\n')
    }
    // Otherwise (paragraph, listitem, etc) join with empty string
    // Listitem usually contains text nodes, so joining with '' is correct for the item content itself.
    return content.children.map((child: any) => richTextToPlainText(child)).join('')
  }

  // Base case: text node
  if (content.text) {
    return content.text
  }

  return ''
}
