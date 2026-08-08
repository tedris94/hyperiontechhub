import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { isPlatformAdmin } from '@/collections/edusuite/shared'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'

/** CSV import for students. Header: Name,Roll_No,Regi_No,Class,Year,Group,GuardianName,GuardianPhone */
export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const schoolSlug = String(body.schoolSlug || '')
  const type = String(body.type || 'students')
  const csv = String(body.csv || '')
  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV needs header + at least one row' }, { status: 400 })
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim())
  const payload = await getPayloadSingleton()
  let created = 0

  if (type === 'students') {
    for (const line of lines.slice(1)) {
      const cols = splitCsvLine(line)
      const row = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? '']))
      const name = row.Name || row.title || row.name
      if (!name) continue
      await payload.create({
        collection: 'edu-students',
        data: {
          school: access.school.id,
          title: name,
          rollNo: row.Roll_No || row.rollNo || '',
          regiNo: row.Regi_No || row.regiNo || '',
          className: row.Class || row.className || '',
          year: row.Year || row.year || '',
          groupName: row.Group || row.groupName || '',
          guardianName: row.GuardianName || row.guardianName || '',
          guardianPhone: row.GuardianPhone || row.guardianPhone || '',
          status: 'active',
        },
        user,
        overrideAccess: isPlatformAdmin(user),
      })
      created += 1
    }
  } else {
    return NextResponse.json({ error: 'Unsupported import type' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, created })
}

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQ = !inQ
      continue
    }
    if (c === ',' && !inQ) {
      out.push(cur)
      cur = ''
      continue
    }
    cur += c
  }
  out.push(cur)
  return out
}
