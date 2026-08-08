'use client'

import { useMemo, useState } from 'react'
import type { PageContent } from '@/lib/icms/types'
import { mergePageContent, pageContentToPayload } from '@/lib/icms/page-payload'
import ImageUploadField from '@/components/icms/ImageUploadField'
import { useIcmsToast } from '@/components/icms/toast'
import {
  BlocksEditor,
  Field,
  OfficeHoursEditor,
  Section,
  TextListEditor,
} from '@/components/icms/PageFieldEditors'

function setField<K extends keyof PageContent>(
  setForm: React.Dispatch<React.SetStateAction<PageContent>>,
  key: K,
) {
  return (v: PageContent[K]) => setForm((s) => ({ ...s, [key]: v }))
}

function HeroSection({
  form,
  setForm,
  note,
}: {
  form: PageContent
  setForm: React.Dispatch<React.SetStateAction<PageContent>>
  note?: string
}) {
  return (
    <Section title="Hero" note={note}>
      <Field
        label="Hero title"
        value={form.heroTitle || ''}
        onChange={(v) => setForm((s) => ({ ...s, heroTitle: v }))}
      />
      <Field
        label="Hero subtitle"
        value={form.heroSubtitle || ''}
        onChange={(v) => setForm((s) => ({ ...s, heroSubtitle: v }))}
        multiline
      />
    </Section>
  )
}

export default function PageEditor({
  tenantSlug,
  pageKeys,
  existing,
}: {
  tenantSlug: string
  pageKeys: string[]
  existing: PageContent[]
}) {
  const toast = useIcmsToast()
  const byKey = useMemo(() => {
    const m = new Map<string, PageContent>()
    for (const p of existing) m.set(p.pageKey, p)
    return m
  }, [existing])

  const [pageKey, setPageKey] = useState(pageKeys[0] || 'home')
  const [form, setForm] = useState<PageContent>(() => mergePageContent(byKey.get(pageKey), pageKey))
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [saving, setSaving] = useState(false)

  function loadKey(key: string) {
    setPageKey(key)
    setForm(mergePageContent(byKey.get(key), key))
    setError('')
    setOk(false)
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setOk(false)
    try {
      const data = pageContentToPayload({ ...form, pageKey })
      const res = await fetch('/api/icms/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert-page',
          tenantSlug,
          data,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setOk(true)
      toast.success(`Page “${pageKey}” saved`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const settingsNote =
    'Centre name, motto, address, phones, bank, and prayer coordinates are under Settings.'

  return (
    <form onSubmit={onSave} className="space-y-6 border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
            Edit page sections
          </h2>
          <p className="mt-1 text-xs text-[color:var(--icms-warm-gray)]">
            {settingsNote} Events, articles, Waqf projects, leadership, and facilities have their own
            admin menus.
          </p>
        </div>
        <label className="block text-sm font-medium">
          Page
          <select
            className="icms-input mt-1.5 min-w-[180px]"
            value={pageKey}
            onChange={(e) => loadKey(e.target.value)}
          >
            {pageKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {ok ? <p className="text-sm text-[color:var(--icms-emerald)]">Page copy saved.</p> : null}

      {pageKey === 'home' ? (
        <>
          <Section
            title="1 · Hero"
            note="Logo, centre name, and motto come from Settings. Edit the headline, blurb, and buttons here."
          >
            <Field
              label="Headline"
              value={form.heroTitle || ''}
              onChange={(v) => setForm((s) => ({ ...s, heroTitle: v }))}
            />
            <Field
              label="Supporting text"
              value={form.heroSubtitle || ''}
              onChange={(v) => setForm((s) => ({ ...s, heroSubtitle: v }))}
              multiline
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Primary button"
                value={form.ctaPrimaryLabel || ''}
                onChange={(v) => setForm((s) => ({ ...s, ctaPrimaryLabel: v }))}
              />
              <Field
                label="Secondary button"
                value={form.ctaSecondaryLabel || ''}
                onChange={(v) => setForm((s) => ({ ...s, ctaSecondaryLabel: v }))}
              />
            </div>
          </Section>

          <Section
            title="2 · Prayer times strip"
            note="Times are calculated live from Settings → Prayer location."
          >
            <Field
              label="Strip heading"
              value={form.prayerHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, prayerHeading: v }))}
            />
          </Section>

          <Section title="3 · Upcoming events" note="Event rows are managed under Admin → Events.">
            <Field
              label="Eyebrow"
              value={form.eventsEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, eventsEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.eventsHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, eventsHeading: v }))}
            />
            <Field
              label="Footer link label"
              value={form.eventsCtaLabel || ''}
              onChange={(v) => setForm((s) => ({ ...s, eventsCtaLabel: v }))}
            />
          </Section>

          <Section title="4 · Waqf & endowments" note="Project rows are managed under Admin → Waqf.">
            <Field
              label="Eyebrow"
              value={form.waqfEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, waqfEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.waqfHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, waqfHeading: v }))}
            />
            <Field
              label="Arabic text"
              value={form.arabicText || ''}
              onChange={(v) => setForm((s) => ({ ...s, arabicText: v }))}
              dir="rtl"
            />
            <Field
              label="Arabic caption"
              value={form.arabicCaption || ''}
              onChange={(v) => setForm((s) => ({ ...s, arabicCaption: v }))}
              multiline
            />
            <Field
              label="Body"
              value={form.waqfBody || ''}
              onChange={(v) => setForm((s) => ({ ...s, waqfBody: v }))}
              multiline
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="CTA button"
                value={form.waqfCtaLabel || ''}
                onChange={(v) => setForm((s) => ({ ...s, waqfCtaLabel: v }))}
              />
              <Field
                label="Campaign goal (₦)"
                value={form.waqfGoalAmount != null ? String(form.waqfGoalAmount) : ''}
                onChange={(v) =>
                  setForm((s) => ({
                    ...s,
                    waqfGoalAmount: v ? Number(v) : undefined,
                  }))
                }
              />
            </div>
          </Section>

          <Section title="5 · Knowledge & reflection" note="Cards come from Admin → Articles.">
            <Field
              label="Eyebrow"
              value={form.articlesEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, articlesEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.articlesHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, articlesHeading: v }))}
            />
            <Field
              label="Link label"
              value={form.articlesCtaLabel || ''}
              onChange={(v) => setForm((s) => ({ ...s, articlesCtaLabel: v }))}
            />
          </Section>

          <Section title="6 · Find us / Contact / Support" note={settingsNote}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Find us eyebrow"
                value={form.findUsEyebrow || ''}
                onChange={(v) => setForm((s) => ({ ...s, findUsEyebrow: v }))}
              />
              <Field
                label="Find us heading"
                value={form.findUsHeading || ''}
                onChange={(v) => setForm((s) => ({ ...s, findUsHeading: v }))}
              />
              <Field
                label="Contact eyebrow"
                value={form.contactEyebrow || ''}
                onChange={(v) => setForm((s) => ({ ...s, contactEyebrow: v }))}
              />
              <Field
                label="Contact heading"
                value={form.contactHeading || ''}
                onChange={(v) => setForm((s) => ({ ...s, contactHeading: v }))}
              />
              <Field
                label="Support eyebrow"
                value={form.supportEyebrow || ''}
                onChange={(v) => setForm((s) => ({ ...s, supportEyebrow: v }))}
              />
              <Field
                label="Support heading"
                value={form.supportHeading || ''}
                onChange={(v) => setForm((s) => ({ ...s, supportHeading: v }))}
              />
            </div>
            <Field
              label="Support blurb"
              value={form.supportBlurb || ''}
              onChange={(v) => setForm((s) => ({ ...s, supportBlurb: v }))}
              multiline
            />
            <Field
              label="Donate button"
              value={form.supportCtaLabel || ''}
              onChange={(v) => setForm((s) => ({ ...s, supportCtaLabel: v }))}
            />
          </Section>
        </>
      ) : null}

      {pageKey === 'about' ? (
        <>
          <HeroSection form={form} setForm={setForm} />

          <Section title="Our Story">
            <Field
              label="Section label"
              value={form.storyEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, storyEyebrow: v }))}
              hint='e.g. "Our Story"'
            />
            <Field
              label="Main heading"
              value={form.introHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, introHeading: v }))}
            />
            <Field
              label="Intro paragraph (optional)"
              value={form.introBody || ''}
              onChange={(v) => setForm((s) => ({ ...s, introBody: v }))}
              multiline
            />
          </Section>

          <Section title="Story blocks" note="Four content cards shown beside the photo.">
            <BlocksEditor
              blocks={form.blocks || []}
              onChange={setField(setForm, 'blocks')}
            />
          </Section>

          <Section title="Photo & quote">
            <ImageUploadField
              label="Story image"
              value={form.imageUrl || ''}
              onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))}
              tenantSlug={tenantSlug}
              hint="Choose a file (saved as AVIF) or paste a local path."
            />
            <Field
              label="Arabic text"
              value={form.arabicText || ''}
              onChange={(v) => setForm((s) => ({ ...s, arabicText: v }))}
              dir="rtl"
            />
            <Field
              label="Image caption / translation"
              value={form.arabicCaption || ''}
              onChange={(v) => setForm((s) => ({ ...s, arabicCaption: v }))}
              multiline
            />
          </Section>

          <Section title="Mission & Vision">
            <Field
              label="Section label"
              value={form.purposeEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, purposeEyebrow: v }))}
              hint='e.g. "Purpose"'
            />
            <Field
              label="Main heading"
              value={form.missionHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, missionHeading: v }))}
            />
            <TextListEditor
              label="Mission points"
              items={form.missionItems || []}
              onChange={setField(setForm, 'missionItems')}
              addLabel="Add mission point"
            />
            <TextListEditor
              label="Vision points"
              items={form.visionItems || []}
              onChange={setField(setForm, 'visionItems')}
              addLabel="Add vision point"
            />
          </Section>

          <Section title="Office hours strip" note="Address and phones come from Settings.">
            <OfficeHoursEditor
              hours={form.officeHours || []}
              onChange={setField(setForm, 'officeHours')}
            />
          </Section>

          <Section title="Map section">
            <Field
              label="Eyebrow"
              value={form.findUsEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, findUsEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.findUsHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, findUsHeading: v }))}
            />
            <Field
              label="Maps button label"
              value={form.mapCtaLabel || ''}
              onChange={(v) => setForm((s) => ({ ...s, mapCtaLabel: v }))}
            />
          </Section>

          <Section title="Footer buttons">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Primary button (solid)"
                value={form.ctaPrimaryLabel || ''}
                onChange={(v) => setForm((s) => ({ ...s, ctaPrimaryLabel: v }))}
                hint="Default: Contact"
              />
              <Field
                label="Secondary button (outlined)"
                value={form.ctaSecondaryLabel || ''}
                onChange={(v) => setForm((s) => ({ ...s, ctaSecondaryLabel: v }))}
                hint="Default: Leadership"
              />
            </div>
          </Section>
        </>
      ) : null}

      {pageKey === 'waqf' ? (
        <>
          <HeroSection form={form} setForm={setForm} />
          <Section title="Understanding Waqf">
            <Field
              label="Section heading"
              value={form.introHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, introHeading: v }))}
            />
            <Field
              label="Intro body"
              value={form.introBody || ''}
              onChange={(v) => setForm((s) => ({ ...s, introBody: v }))}
              multiline
            />
            <Field
              label="Arabic text"
              value={form.arabicText || ''}
              onChange={(v) => setForm((s) => ({ ...s, arabicText: v }))}
              dir="rtl"
            />
            <Field
              label="Arabic caption"
              value={form.arabicCaption || ''}
              onChange={(v) => setForm((s) => ({ ...s, arabicCaption: v }))}
              multiline
            />
          </Section>
          <Section title="How it works" note="Step blocks shown on the Waqf page.">
            <BlocksEditor blocks={form.blocks || []} onChange={setField(setForm, 'blocks')} />
          </Section>
          <Section title="Campaign" note="Project rows are managed under Admin → Waqf.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={form.waqfEyebrow || ''}
                onChange={(v) => setForm((s) => ({ ...s, waqfEyebrow: v }))}
              />
              <Field
                label="Heading"
                value={form.waqfHeading || ''}
                onChange={(v) => setForm((s) => ({ ...s, waqfHeading: v }))}
              />
            </div>
            <Field
              label="Body"
              value={form.waqfBody || ''}
              onChange={(v) => setForm((s) => ({ ...s, waqfBody: v }))}
              multiline
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="CTA label"
                value={form.waqfCtaLabel || ''}
                onChange={(v) => setForm((s) => ({ ...s, waqfCtaLabel: v }))}
              />
              <Field
                label="Goal (₦)"
                value={form.waqfGoalAmount != null ? String(form.waqfGoalAmount) : ''}
                onChange={(v) =>
                  setForm((s) => ({
                    ...s,
                    waqfGoalAmount: v ? Number(v) : undefined,
                  }))
                }
              />
            </div>
          </Section>
        </>
      ) : null}

      {pageKey === 'mosque' ? (
        <>
          <HeroSection form={form} setForm={setForm} />
          <Section title="Intro">
            <Field
              label="Intro heading"
              value={form.introHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, introHeading: v }))}
            />
            <Field
              label="Intro body"
              value={form.introBody || ''}
              onChange={(v) => setForm((s) => ({ ...s, introBody: v }))}
              multiline
            />
          </Section>
          <Section title="Jum’uah note">
            <Field
              label="Note"
              value={form.jumuahNote || ''}
              onChange={(v) => setForm((s) => ({ ...s, jumuahNote: v }))}
              multiline
            />
          </Section>
          <Section title="Facilities" note="Facility rows are managed under Admin → Facilities.">
            <p className="text-xs text-[color:var(--icms-warm-gray)]">
              Prayer times are calculated from Settings → Prayer location.
            </p>
          </Section>
        </>
      ) : null}

      {pageKey === 'contact' ? (
        <>
          <HeroSection form={form} setForm={setForm} />
          <Section title="Contact form">
            <TextListEditor
              label="Form subject options"
              items={form.formSubjects || []}
              onChange={setField(setForm, 'formSubjects')}
              addLabel="Add subject"
            />
          </Section>
          <Section title="Office hours">
            <OfficeHoursEditor
              hours={form.officeHours || []}
              onChange={setField(setForm, 'officeHours')}
            />
          </Section>
          <Section title="Map section">
            <Field
              label="Eyebrow"
              value={form.findUsEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, findUsEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.findUsHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, findUsHeading: v }))}
            />
            <Field
              label="Maps button label"
              value={form.mapCtaLabel || ''}
              onChange={(v) => setForm((s) => ({ ...s, mapCtaLabel: v }))}
            />
          </Section>
        </>
      ) : null}

      {pageKey === 'donate' ? (
        <>
          <HeroSection form={form} setForm={setForm} />
          <Section title="Support copy">
            <Field
              label="Support blurb"
              value={form.supportBlurb || ''}
              onChange={(v) => setForm((s) => ({ ...s, supportBlurb: v }))}
              multiline
            />
          </Section>
          <Section title="Donation funds" note="Fund rows are managed under Admin → Donate funds.">
            <p className="text-xs text-[color:var(--icms-warm-gray)]">
              Bank details and Paystack are configured under Settings.
            </p>
          </Section>
        </>
      ) : null}

      {pageKey === 'events' ? (
        <>
          <HeroSection form={form} setForm={setForm} note="Event rows are managed under Admin → Events." />
          <Section title="Section labels">
            <Field
              label="Eyebrow"
              value={form.eventsEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, eventsEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.eventsHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, eventsHeading: v }))}
            />
          </Section>
        </>
      ) : null}

      {pageKey === 'articles' ? (
        <>
          <HeroSection
            form={form}
            setForm={setForm}
            note="Article rows are managed under Admin → Articles."
          />
          <Section title="Section labels">
            <Field
              label="Eyebrow"
              value={form.articlesEyebrow || ''}
              onChange={(v) => setForm((s) => ({ ...s, articlesEyebrow: v }))}
            />
            <Field
              label="Heading"
              value={form.articlesHeading || ''}
              onChange={(v) => setForm((s) => ({ ...s, articlesHeading: v }))}
            />
          </Section>
        </>
      ) : null}

      {pageKey === 'leadership' ? (
        <>
          <HeroSection
            form={form}
            setForm={setForm}
            note="Leader profiles are managed under Admin → Leadership."
          />
        </>
      ) : null}

      {pageKey === 'committee' ? (
        <>
          <HeroSection
            form={form}
            setForm={setForm}
            note="Shurah / committee members are managed under Admin → Shurah / Committee."
          />
        </>
      ) : null}

      {pageKey === 'islamiyyah' ? (
        <>
          <HeroSection
            form={form}
            setForm={setForm}
            note="Classes and enrolment are managed in the Islamiyyah admin area."
          />
        </>
      ) : null}

      <button type="submit" className="icms-btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save page sections'}
      </button>
    </form>
  )
}
