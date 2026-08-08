'use client'

import { useEffect, useState } from 'react'
import type { Article } from '@/lib/icms/types'
import ImageUploadField from '@/components/icms/ImageUploadField'
import { useIcmsToast } from '@/components/icms/toast'

export default function ArticleEditor({
  tenantSlug,
  article,
  onCancel,
  onSaved,
}: {
  tenantSlug: string
  article?: Article
  onCancel?: () => void
  onSaved?: (article: Article, mode: 'create' | 'update') => void
}) {
  const toast = useIcmsToast()
  const isEdit = Boolean(article)
  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [body, setBody] = useState(article?.body.join('\n\n') || '')
  const [author, setAuthor] = useState(article?.author || '')
  const [category, setCategory] = useState(article?.category || 'Announcements')
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(article?.title || '')
    setSlug(article?.slug || '')
    setExcerpt(article?.excerpt || '')
    setBody(article?.body.join('\n\n') || '')
    setAuthor(article?.author || '')
    setCategory(article?.category || 'Announcements')
    setCoverImageUrl(article?.coverImageUrl || '')
  }, [article])

  async function save(status: 'draft' | 'published') {
    setSaving(true)
    setError('')
    try {
      const paragraphs = body
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
      const payload = {
        title,
        slug:
          slug ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        excerpt,
        author,
        category,
        coverImageUrl: coverImageUrl || undefined,
        body: paragraphs.map((paragraph) => ({ paragraph })),
        status,
        publishedAt: status === 'published' ? new Date().toISOString().slice(0, 10) : undefined,
      }
      const res = await fetch('/api/icms/records', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEdit
            ? { collection: 'icms-articles', tenantSlug, id: article!.id, data: payload }
            : { collection: 'icms-articles', tenantSlug, data: payload },
        ),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      const doc = data.doc || {}
      const mapped: Article = {
        id: String(doc.id ?? article?.id ?? ''),
        title: String(doc.title ?? title),
        slug: String(doc.slug ?? payload.slug),
        excerpt: String(doc.excerpt ?? excerpt),
        author: String(doc.author ?? author),
        category: String(doc.category ?? category),
        coverImageUrl: doc.coverImageUrl ? String(doc.coverImageUrl) : coverImageUrl || undefined,
        body: paragraphs,
        status: (doc.status as Article['status']) || status,
        date: String(doc.publishedAt || doc.updatedAt || payload.publishedAt || '').slice(0, 10),
      }
      toast.success(status === 'published' ? 'Article published' : 'Draft saved')
      onSaved?.(mapped, isEdit ? 'update' : 'create')
      if (!isEdit) {
        setTitle('')
        setSlug('')
        setExcerpt('')
        setBody('')
        setCoverImageUrl('')
      }
      onCancel?.()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="icms-display text-xl text-[color:var(--icms-forest)]">
          {isEdit ? 'Edit article' : 'New article'}
        </h2>
        {onCancel ? (
          <button
            type="button"
            className="text-xs text-[color:var(--icms-warm-gray)] hover:underline"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Title
          <input
            className="icms-input mt-1.5"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!isEdit && !slug) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, ''),
                )
              }
            }}
          />
        </label>
        <label className="text-sm font-medium">
          Slug
          <input className="icms-input mt-1.5" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Author
          <input
            className="icms-input mt-1.5"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Category
          <input
            className="icms-input mt-1.5"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium">
        Excerpt
        <textarea
          className="icms-input mt-1.5"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </label>
      <div className="mt-4">
        <ImageUploadField
          label="Cover image"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          tenantSlug={tenantSlug}
        />
      </div>
      <label className="mt-4 block text-sm font-medium">
        Body (paragraphs separated by blank lines)
        <textarea
          className="icms-input mt-1.5 min-h-48"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="icms-btn-secondary"
          disabled={saving || !title.trim()}
          onClick={() => void save('draft')}
        >
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          type="button"
          className="icms-btn-primary"
          disabled={saving || !title.trim()}
          onClick={() => void save('published')}
        >
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
