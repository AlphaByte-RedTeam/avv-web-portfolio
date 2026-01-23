import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
  content: any
  className?: string
}

const serialize = (children: any[]): React.ReactNode[] => {
  if (!children) return []

  return children.map((node, index) => {
    if (node.type === 'text') {
      let text = <React.Fragment key={`${node.type}-${index}`}>{node.text}</React.Fragment>

      if (node.format & 1) text = <strong key={`${node.type}-${index}`}>{text}</strong>
      if (node.format & 2) text = <em key={`${node.type}-${index}`}>{text}</em>
      if (node.format & 4) text = <s key={`${node.type}-${index}`}>{text}</s>
      if (node.format & 8) text = <u key={`${node.type}-${index}`}>{text}</u>
      if (node.format & 16)
        text = (
          <code
            className="bg-orange-200 dark:bg-orange-300 px-2 py-0.5 rounded-sm text-orange-700 dark:text-orange-700"
            key={`${node.type}-${index}`}
          >
            {text}
          </code>
        )

      return text
    }

    if (node.type === 'link') {
      const { url, newTab } = node.fields || {}
      const href = url || '#'

      const props: any = {
        href,
        className:
          'text-primary underline underline-offset-4 hover:text-primary/80 transition-colors',
      }

      if (newTab) {
        props.target = '_blank'
        props.rel = 'noopener noreferrer'
      }

      return (
        <Link key={`${node.type}-${index}`} {...props}>
          {serialize(node.children)}
        </Link>
      )
    }

    if (node.type === 'list') {
      const Tag = node.tag === 'ol' ? 'ol' : 'ul'
      const listClass = node.tag === 'ol' ? 'list-decimal' : 'list-disc'
      return (
        <Tag
          key={`${node.type}-${index}`}
          className={`${listClass} list-outside ml-5 mb-4 space-y-1`}
        >
          {serialize(node.children)}
        </Tag>
      )
    }

    if (node.type === 'listitem') {
      return (
        <li key={`${node.type}-${index}`} className="pl-1">
          {serialize(node.children)}
        </li>
      )
    }

    if (node.type === 'heading') {
      const Tag = node.tag as keyof React.JSX.IntrinsicElements
      const sizes = {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-semibold mb-3',
        h3: 'text-xl font-medium mb-2',
        h4: 'text-lg font-medium mb-2',
        h5: 'text-base font-medium mb-1',
        h6: 'text-sm font-medium mb-1',
      }
      return (
        <Tag key={`${node.type}-${index}`} className={sizes[node.tag as keyof typeof sizes] || ''}>
          {serialize(node.children)}
        </Tag>
      )
    }

    if (node.type === 'quote') {
      return (
        <blockquote
          key={`${node.type}-${index}`}
          className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
        >
          {serialize(node.children)}
        </blockquote>
      )
    }

    if (node.type === 'block' && node.fields?.blockType === 'code') {
      const code = node.fields.code
      const language = node.fields.language

      return (
        <div key={`${node.type}-${index}`} className="my-4 rounded-md overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderRadius: '0.375rem' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )
    }

    if (node.type === 'code') {
      // Fallback for native code blocks if any exist
      const code = node.children?.[0]?.text || ''

      return (
        <pre
          key={`${node.type}-${index}`}
          className="bg-secondary/50 p-4 rounded-md overflow-x-auto my-4"
        >
          <code className="text-sm font-mono text-foreground">{code}</code>
        </pre>
      )
    }

    if (node.type === 'upload') {
      const { value } = node
      if (!value?.url) return null

      return (
        <div
          key={`${node.type}-${index}`}
          className="my-8 relative w-full rounded-lg overflow-hidden"
        >
          <Image
            src={value.url}
            alt={value.alt || 'Blog post image'}
            width={value.width || 800}
            height={value.height || 600}
            className="w-full h-auto object-cover"
          />
        </div>
      )
    }

    if (node.type === 'paragraph') {
      return (
        <p key={`${node.type}-${index}`} className="mb-4 last:mb-0 leading-relaxed">
          {serialize(node.children)}
        </p>
      )
    }

    return null
  })
}

export const RichText: React.FC<Props> = ({ content, className }) => {
  if (!content?.root?.children) return null

  return <div className={className}>{serialize(content.root.children)}</div>
}
