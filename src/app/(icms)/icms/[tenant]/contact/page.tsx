import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPageContent } from '@/lib/icms/content'
import ContactClient from './ContactClient'

type Props = { params: Promise<{ tenant: string }> }

export default async function ContactPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const page = await getPageContent(doc.id, 'contact')

  return (
    <ContactClient
      tenant={tenant}
      page={page}
      subjects={
        page.formSubjects?.length
          ? page.formSubjects
          : [
              'General Enquiry',
              'Prayer Times',
              'Events & Programmes',
              'Donations & Waqf',
              'Other',
            ]
      }
    />
  )
}
