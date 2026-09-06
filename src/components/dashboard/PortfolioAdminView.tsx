'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DashboardLayout } from './DashboardLayout'
import { ExternalLink, Pencil, Plus, RefreshCw, Save, X } from 'lucide-react'

type PortfolioItem = {
  id: number | string
  title: string
  slug: string
  client: string
  industry: string
  category: string
  summary: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  projectUrl: string
  logoPath: string
  previewImagePath: string
  brandColors: string[]
  featured: boolean
  sortOrder: number
  logoUrl?: string | null
  featuredImageUrl?: string | null
}

type FormState = {
  title: string
  slug: string
  client: string
  industry: string
  category: string
  summary: string
  projectUrl: string
  logoPath: string
  previewImagePath: string
  brandColors: string
  featured: boolean
  sortOrder: number
}

const EMPTY: FormState = {
  title: '',
  slug: '',
  client: '',
  industry: 'schools',
  category: '',
  summary: '',
  projectUrl: '',
  logoPath: '',
  previewImagePath: '',
  brandColors: '',
  featured: true,
  sortOrder: 0,
}

function toForm(item: PortfolioItem): FormState {
  return {
    title: item.title,
    slug: item.slug,
    client: item.client,
    industry: item.industry,
    category: item.category,
    summary: item.summary,
    projectUrl: item.projectUrl,
    logoPath: item.logoPath,
    previewImagePath: item.previewImagePath,
    brandColors: item.brandColors.join(', '),
    featured: item.featured,
    sortOrder: item.sortOrder,
  }
}

export function PortfolioAdminView() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/portfolio', { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setItems(data.items || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function openEdit(item: PortfolioItem) {
    setCreating(false)
    setEditing(item)
    setForm(toForm(item))
    setMessage('')
  }

  function openCreate() {
    setEditing(null)
    setCreating(true)
    setForm(EMPTY)
    setMessage('')
  }

  function closeModal() {
    setEditing(null)
    setCreating(false)
  }

  async function seedFromFallback() {
    setSeeding(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedFromFallback: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Seed failed')
      setMessage(`Seeded ${data.seeded} case(s) from site defaults.`)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim() || !form.client.trim()) {
      setError('Title, slug, and client are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        brandColors: form.brandColors
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      }
      const res = await fetch(
        creating ? '/api/admin/portfolio' : `/api/admin/portfolio/${editing?.id}`,
        {
          method: creating ? 'POST' : 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setMessage(creating ? 'Case study created.' : 'Case study updated — live URL is now public.')
      closeModal()
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const modalOpen = creating || Boolean(editing)

  return (
    <DashboardLayout title="Portfolio">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl text-[#1a1f71] mb-2">Portfolio case studies</h2>
            <p className="text-gray-600 max-w-2xl">
              Update live app URLs, logos, and previews shown on the home logo garden and{' '}
              <Link href="/portfolio" className="text-[#1A2BC2] hover:underline" target="_blank">
                /portfolio
              </Link>
              . When a client domain changes, edit the Live app URL here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void seedFromFallback()}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              Seed defaults
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A2BC2] text-white hover:bg-[#0D0D52]"
            >
              <Plus className="w-4 h-4" />
              Add case
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-red-700">{error}</div>
        )}
        {message && (
          <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-4 text-green-800">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-600 mb-4">
              No CMS portfolio items yet. The public site still uses JSON defaults. Seed them to
              manage live URLs from admin.
            </p>
            <button
              type="button"
              onClick={() => void seedFromFallback()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A2BC2] text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Seed BOS, HMIS, Anas & Fizam
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Live app URL</th>
                    <th className="px-4 py-3 font-medium">Industry</th>
                    <th className="px-4 py-3 font-medium">Featured</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const logoSrc = item.logoUrl || item.logoPath
                    return (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {logoSrc ? (
                              <div className="relative h-10 w-10 shrink-0">
                                <Image
                                  src={logoSrc}
                                  alt=""
                                  fill
                                  className="object-contain"
                                  sizes="40px"
                                />
                              </div>
                            ) : null}
                            <div>
                              <p className="font-medium text-[#1B1C1E]">{item.client}</p>
                              <p className="text-xs text-gray-500">{item.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {item.projectUrl ? (
                            <a
                              href={item.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#1A2BC2] hover:underline break-all"
                            >
                              {item.projectUrl}
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-amber-600">Not set</span>
                          )}
                        </td>
                        <td className="px-4 py-3 capitalize">{item.industry}</td>
                        <td className="px-4 py-3">{item.featured ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center gap-1 text-[#1A2BC2] hover:underline"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-[#1a1f71]">
                {creating ? 'Add case study' : `Edit ${editing?.client}`}
              </h3>
              <button type="button" onClick={closeModal} className="p-1 text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <label className="block">
                <span className="text-sm text-gray-600">Live app URL</span>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.projectUrl}
                  onChange={(e) => setForm((f) => ({ ...f, projectUrl: e.target.value }))}
                  placeholder="https://bos.hyperiontechhub.com/"
                />
                <span className="text-xs text-gray-400 mt-1 block">
                  Visitors open this from the case study page.
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block col-span-2">
                  <span className="text-sm text-gray-600">Client</span>
                  <input
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={form.client}
                    onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                  />
                </label>
                <label className="block col-span-2">
                  <span className="text-sm text-gray-600">Title</span>
                  <input
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Slug</span>
                  <input
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Industry</span>
                  <select
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={form.industry}
                    onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                  >
                    <option value="schools">Schools</option>
                    <option value="mosques">Mosques</option>
                    <option value="smes">SMEs</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm text-gray-600">Logo path</span>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.logoPath}
                  onChange={(e) => setForm((f) => ({ ...f, logoPath: e.target.value }))}
                  placeholder="/assets/clients/bright-olivelight.png"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Preview image path</span>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.previewImagePath}
                  onChange={(e) => setForm((f) => ({ ...f, previewImagePath: e.target.value }))}
                  placeholder="/assets/portfolio/fizam-preview.png"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Brand colors (comma-separated hex)</span>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.brandColors}
                  onChange={(e) => setForm((f) => ({ ...f, brandColors: e.target.value }))}
                  placeholder="#6D1B72, #36136D, #CF7088"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Summary</span>
                <textarea
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px]"
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                />
              </label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  Featured on home
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  Sort
                  <input
                    type="number"
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1"
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A2BC2] text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
