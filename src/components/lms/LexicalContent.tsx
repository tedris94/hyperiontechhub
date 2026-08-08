import type { ReactNode } from 'react'

type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  format?: number
  children?: LexicalNode[]
  listType?: string
  [key: string]: unknown
}

function renderNode(node: LexicalNode, key: number): ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    let content: ReactNode = node.text ?? ''
    if (node.format && typeof node.format === 'number') {
      if (node.format & 1) content = <strong key={key}>{content}</strong>
      if (node.format & 2) content = <em key={key}>{content}</em>
    }
    return content
  }

  const children = (node.children ?? []).map((child, i) => renderNode(child, i))

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="mb-4 text-gray-700 leading-relaxed">
          {children}
        </p>
      )
    case 'heading':
      if (node.tag === 'h2') {
        return (
          <h2 key={key} className="text-2xl font-semibold mb-3 text-[#1B1C1E]">
            {children}
          </h2>
        )
      }
      if (node.tag === 'h3') {
        return (
          <h3 key={key} className="text-xl font-semibold mb-2 text-[#1B1C1E]">
            {children}
          </h3>
        )
      }
      return (
        <h4 key={key} className="text-lg font-medium mb-2 text-[#1B1C1E]">
          {children}
        </h4>
      )
    case 'list':
      if (node.listType === 'number') {
        return (
          <ol key={key} className="list-decimal pl-6 mb-4 space-y-1 text-gray-700">
            {children}
          </ol>
        )
      }
      return (
        <ul key={key} className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          {children}
        </ul>
      )
    case 'listitem':
      return <li key={key}>{children}</li>
    case 'link':
      return (
        <a
          key={key}
          href={String(node.url ?? '#')}
          className="text-[#1A2BC2] underline"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      )
    case 'root':
      return <div key={key}>{children}</div>
    default:
      return children.length > 0 ? <div key={key}>{children}</div> : null
  }
}

export function LexicalContent({ content }: { content: unknown }) {
  if (!content || typeof content !== 'object') return null
  const root = (content as { root?: LexicalNode }).root ?? (content as LexicalNode)
  return <div className="prose prose-lg max-w-none">{renderNode(root, 0)}</div>
}
