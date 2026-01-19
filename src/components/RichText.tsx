import React from 'react'

type Props = {
  content: any
  className?: string
}

export const RichText: React.FC<Props> = ({ content, className }) => {
  if (!content) return null

  // Very basic Lexical to HTML/React converter for simple text
  // In a real project, you'd use a more robust converter or Payload's own
  return (
    <div className={className}>
      {content.root?.children?.map((node: any, index: number) => {
        if (node.type === 'paragraph') {
          return (
            <p key={index} className="mb-4 last:mb-0">
              {node.children?.map((child: any, childIndex: number) => {
                if (child.type === 'text') {
                  let text = child.text
                  if (child.format & 1) text = <strong key={childIndex}>{text}</strong>
                  if (child.format & 2) text = <em key={childIndex}>{text}</em>
                  return text
                }
                return null
              })}
            </p>
          )
        }
        if (node.type === 'list') {
          const Tag = node.tag === 'ol' ? 'ol' : 'ul'
          return (
            <Tag key={index} className="list-inside list-disc mb-4 ml-4">
              {node.children?.map((item: any, itemIndex: number) => (
                <li key={itemIndex}>
                  {item.children?.map((child: any, childIndex: number) => child.text)}
                </li>
              ))}
            </Tag>
          )
        }
        return null
      })}
    </div>
  )
}
