import Link from 'next/link'
import React from 'react'

type Props = {
  content: any
  className?: string
}

const serialize = (children: any[]): React.ReactNode[] => {
  if (!children) return []

  return children.map((node, index) => {
    if (node.type === 'text') {
      let text = <React.Fragment key={index}>{node.text}</React.Fragment>

      if (node.format & 1) text = <strong key={index}>{text}</strong>
      if (node.format & 2) text = <em key={index}>{text}</em>
      if (node.format & 4) text = <s key={index}>{text}</s>
      if (node.format & 8) text = <u key={index}>{text}</u>
      if (node.format & 16) text = <code key={index}>{text}</code>
      
      return text
    }

    if (node.type === 'link') {
      const { url, newTab } = node.fields || {}
      const href = url || '#'
      
      const props: any = {
        href,
        className: 'text-primary underline underline-offset-4 hover:text-primary/80 transition-colors',
      }
      
      if (newTab) {
        props.target = '_blank'
        props.rel = 'noopener noreferrer'
      }

      return (
        <Link key={index} {...props}>
          {serialize(node.children)}
        </Link>
      )
    }

    if (node.type === 'list') {
        const Tag = node.tag === 'ol' ? 'ol' : 'ul'
        const listClass = node.tag === 'ol' ? 'list-decimal' : 'list-disc'
        return (
            <Tag key={index} className={`${listClass} list-outside ml-5 mb-4 space-y-1`}>
                {serialize(node.children)}
            </Tag>
        )
    }

    if (node.type === 'listitem') {
        return (
            <li key={index} className="pl-1">
                {serialize(node.children)}
            </li>
        )
    }
    
    if (node.type === 'heading') {
        const Tag = node.tag as keyof React.JSX.IntrinsicElements
        const sizes = {
          h1: "text-3xl font-bold mb-4",
          h2: "text-2xl font-semibold mb-3",
          h3: "text-xl font-medium mb-2",
          h4: "text-lg font-medium mb-2",
          h5: "text-base font-medium mb-1",
          h6: "text-sm font-medium mb-1",
        }
        return (
            <Tag key={index} className={sizes[node.tag as keyof typeof sizes] || ""}>
                {serialize(node.children)}
            </Tag>
        )
    }

    if (node.type === 'quote') {
      return (
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
          {serialize(node.children)}
        </blockquote>
      )
    }

    if (node.type === 'code') {
      return (
        <pre key={index} className="bg-secondary/50 p-4 rounded-md overflow-x-auto my-4">
          <code className="text-sm font-mono text-foreground">
            {serialize(node.children)}
          </code>
        </pre>
      )
    }

    if (node.type === 'paragraph') {
        return (
            <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                {serialize(node.children)}
            </p>
        )
    }

    return null
  })
}

export const RichText: React.FC<Props> = ({ content, className }) => {
  if (!content?.root?.children) return null

  return (
    <div className={className}>
      {serialize(content.root.children)}
    </div>
  )
}
