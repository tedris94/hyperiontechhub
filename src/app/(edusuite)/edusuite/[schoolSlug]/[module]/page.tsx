import { notFound } from 'next/navigation'
import EduModuleCrud from '@/components/edusuite/EduModuleCrud'
import { getSchoolBySlug } from '@/lib/edusuite/tenant'
import { MODULE_CONFIG } from '@/lib/edusuite/modules'

type Props = { params: Promise<{ schoolSlug: string; module: string }> }

export default async function ModulePage({ params }: Props) {
  const { schoolSlug, module } = await params
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) notFound()
  const config = MODULE_CONFIG[module]
  if (!config) notFound()

  return (
    <EduModuleCrud
      schoolId={school.id}
      schoolSlug={school.slug}
      collection={config.collection}
      title={config.title}
      fields={config.fields}
    />
  )
}
