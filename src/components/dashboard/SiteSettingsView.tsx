'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from './DashboardLayout'
import { Save, Users } from 'lucide-react'

type SiteAppSettings = {
  showDemoAccounts: boolean
}

export function SiteSettingsView({ role }: { role: string }) {
  const [settings, setSettings] = useState<SiteAppSettings>({ showDemoAccounts: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/site-settings', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load site settings')
        const data = (await res.json()) as SiteAppSettings
        if (active) setSettings({ showDemoAccounts: data.showDemoAccounts !== false })
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSettings({ showDemoAccounts: data.showDemoAccounts !== false })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Site Settings" role={role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl text-[#1a1f71] mb-2">Site Settings</h2>
          <p className="text-gray-600">
            Production and environment controls for Hyperion Tech Hub.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-red-700">{error}</div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div>
              <h3 className="text-xl text-[#1a1f71]">Login page</h3>
              <p className="text-sm text-gray-500">Control demo access on the public sign-in screen</p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.showDemoAccounts}
              disabled={loading || saving}
              onChange={(e) => setSettings({ showDemoAccounts: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1a1f71] focus:ring-[#2563eb]"
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Show Demo Accounts</span>
              <span className="mt-1 block text-sm text-gray-600">
                When checked, the login page shows the Demo Accounts section (Show / Hide and one-click
                demo logins). Uncheck this on live production so visitors only see the normal sign-in form.
              </span>
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-4">
          {saved && <span className="text-green-600 text-sm">Saved!</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1a1f71] to-[#2563eb] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
