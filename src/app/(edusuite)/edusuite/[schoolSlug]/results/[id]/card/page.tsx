import { notFound } from 'next/navigation'
import { getSchoolBySlug } from '@/lib/edusuite/tenant'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { buildReportCardPayload } from '@/lib/edusuite/reportCard'
import type { GradeBand } from '@/lib/edusuite/grading'
import ReportCardPrint from '@/components/edusuite/ReportCardPrint'

type Props = { params: Promise<{ schoolSlug: string; id: string }> }

export default async function ResultCardPage({ params }: Props) {
  const { schoolSlug, id } = await params
  const schoolLite = await getSchoolBySlug(schoolSlug)
  if (!schoolLite || !isPayloadEnabled()) notFound()

  const payload = await getPayloadSingleton()
  const school = await payload.findByID({
    collection: 'schools',
    id: schoolLite.id,
    depth: 0,
    overrideAccess: true,
  })
  const result = await payload.findByID({
    collection: 'edu-results',
    id,
    depth: 0,
    overrideAccess: true,
  })
  if (!result || String((result as { school?: unknown }).school) !== String(schoolLite.id)) {
    notFound()
  }

  const className = String((result as { className?: string }).className || '')
  const ct = await payload.find({
    collection: 'edu-class-teachers',
    where: {
      and: [{ school: { equals: schoolLite.id } }, { className: { equals: className } }],
    },
    limit: 1,
    overrideAccess: true,
  })

  const card = buildReportCardPayload({
    school: {
      name: String((school as { name?: string }).name || schoolLite.name),
      address: (school as { address?: string }).address,
      primaryColor: (school as { primaryColor?: string }).primaryColor,
      principalName: (school as { principalName?: string }).principalName,
      principalSignatureUrl: (school as { principalSignatureUrl?: string }).principalSignatureUrl,
      gradingScale: (school as { gradingScale?: GradeBand[] }).gradingScale,
    },
    result: result as Parameters<typeof buildReportCardPayload>[0]['result'],
    classTeacher: ct.docs[0]
      ? {
          title: (ct.docs[0] as { title?: string }).title,
          signatureUrl: (ct.docs[0] as { signatureUrl?: string }).signatureUrl,
          autoRemark: (ct.docs[0] as { autoRemark?: string }).autoRemark,
        }
      : null,
  })

  return <ReportCardPrint card={card} backHref={`/edusuite/${schoolSlug}/results`} />
}
