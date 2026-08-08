'use client'

import { useEffect, useState } from 'react'
import type { Article } from '@/lib/icms/types'
import ArticleEditor from './ArticleEditor'
import DeleteRecordButton from '@/components/icms/DeleteRecordButton'

export default function ArticlesAdmin({
  tenantSlug,
  articles: initialArticles,
}: {
  tenantSlug: string
  articles: Article[]
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [editing, setEditing] = useState<Article | null>(null)

  useEffect(() => {
    setArticles(initialArticles)
  }, [initialArticles])

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-sm text-[color:var(--icms-warm-gray)]">
                  No articles yet.
                </td>
              </tr>
            ) : null}
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 capitalize">{a.status}</td>
                <td className="px-4 py-3">{a.author}</td>
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="text-xs font-medium text-[color:var(--icms-emerald)] hover:underline"
                      onClick={() => setEditing(a)}
                    >
                      Edit
                    </button>
                    <DeleteRecordButton
                      collection="icms-articles"
                      id={a.id}
                      tenantSlug={tenantSlug}
                      onSuccess={() =>
                        setArticles((prev) => prev.filter((x) => String(x.id) !== String(a.id)))
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ArticleEditor
        tenantSlug={tenantSlug}
        article={editing || undefined}
        onCancel={editing ? () => setEditing(null) : undefined}
        onSaved={(mapped, mode) => {
          setArticles((prev) => {
            if (mode === 'create') return [mapped, ...prev]
            return prev.map((a) => (String(a.id) === String(mapped.id) ? mapped : a))
          })
          setEditing(null)
        }}
      />
    </div>
  )
}
