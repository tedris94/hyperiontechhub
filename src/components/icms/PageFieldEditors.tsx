'use client'

export function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
  dir,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
  dir?: 'rtl' | 'ltr'
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {hint ? (
        <span className="mt-0.5 block text-xs font-normal text-[color:var(--icms-warm-gray)]">
          {hint}
        </span>
      ) : null}
      {multiline ? (
        <textarea
          className="icms-input mt-1.5"
          rows={3}
          value={value}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="icms-input mt-1.5"
          value={value}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

export function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3 border border-black/10 bg-[color:var(--icms-ivory)]/40 p-5">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          {title}
        </h3>
        {note ? <p className="mt-1 text-xs text-[color:var(--icms-warm-gray)]">{note}</p> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function BlocksEditor({
  blocks,
  onChange,
}: {
  blocks: { title: string; body: string }[]
  onChange: (blocks: { title: string; body: string }[]) => void
}) {
  function update(i: number, patch: Partial<{ title: string; body: string }>) {
    onChange(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  }

  function remove(i: number) {
    onChange(blocks.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div key={i} className="space-y-2 border border-black/10 bg-white p-4">
          <Field label="Title" value={block.title} onChange={(v) => update(i, { title: v })} />
          <Field
            label="Body"
            value={block.body}
            onChange={(v) => update(i, { body: v })}
            multiline
          />
          <button
            type="button"
            className="text-xs text-red-700 hover:underline"
            onClick={() => remove(i)}
          >
            Remove block
          </button>
        </div>
      ))}
      <button
        type="button"
        className="icms-btn-secondary text-xs"
        onClick={() => onChange([...blocks, { title: '', body: '' }])}
      >
        Add block
      </button>
    </div>
  )
}

export function TextListEditor({
  label,
  items,
  onChange,
  addLabel = 'Add item',
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  addLabel?: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="icms-input flex-1"
            value={item}
            onChange={(e) =>
              onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))
            }
          />
          <button
            type="button"
            className="shrink-0 px-2 text-xs text-red-700 hover:underline"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="icms-btn-secondary text-xs"
        onClick={() => onChange([...items, ''])}
      >
        {addLabel}
      </button>
    </div>
  )
}

export function OfficeHoursEditor({
  hours,
  onChange,
}: {
  hours: { label: string; value: string }[]
  onChange: (hours: { label: string; value: string }[]) => void
}) {
  function update(i: number, patch: Partial<{ label: string; value: string }>) {
    onChange(hours.map((h, idx) => (idx === i ? { ...h, ...patch } : h)))
  }

  return (
    <div className="space-y-3">
      {hours.map((row, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-2">
          <Field label="Label" value={row.label} onChange={(v) => update(i, { label: v })} />
          <Field label="Hours" value={row.value} onChange={(v) => update(i, { value: v })} />
          <button
            type="button"
            className="text-xs text-red-700 hover:underline sm:col-span-2"
            onClick={() => onChange(hours.filter((_, idx) => idx !== i))}
          >
            Remove row
          </button>
        </div>
      ))}
      <button
        type="button"
        className="icms-btn-secondary text-xs"
        onClick={() => onChange([...hours, { label: '', value: '' }])}
      >
        Add hours row
      </button>
    </div>
  )
}
