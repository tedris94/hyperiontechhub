import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import type { SchoolDoc } from '@/lib/edusuite/tenant'

export const metadata = {
  title: 'EduSuite | Hyperion Tech Hub',
  description: 'Open your school workspace in Hyperion EduSuite.',
}

export default async function EduSuiteIndexPage() {
  let schools: SchoolDoc[] = []
  if (isPayloadEnabled()) {
    try {
      const payload = await getPayloadSingleton()
      const result = await payload.find({
        collection: 'schools',
        where: { status: { equals: 'active' } },
        limit: 50,
        sort: 'name',
      })
      schools = result.docs as unknown as SchoolDoc[]
    } catch {
      schools = []
    }
  }

  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="py-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-semibold text-[#1B1C1E] mb-3">Hyperion EduSuite</h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose a school workspace. Sign in required. Demo school is seeded as Hyperion Demo Academy.
          </p>

          {schools.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <p className="text-gray-600 mb-4">
                No schools yet. Run <code className="text-sm bg-gray-100 px-1 rounded">npm run seed:edusuite</code> after
                migrate, or create a school in Payload admin / EduSuite admin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/edusuite/admin" className="text-[#1A2BC2] font-medium hover:underline">
                  Platform admin
                </Link>
                <Link href="/products/edusuite" className="text-[#1A2BC2] font-medium hover:underline">
                  Back to product page
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {schools.map((s) => (
                <Link
                  key={String(s.id)}
                  href={`/edusuite/${s.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1A2BC2] hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-[#1B1C1E] text-lg">{s.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(s.schoolType || 'private').replace(/^\w/, (c) => c.toUpperCase())}
                    {s.city ? ` · ${s.city}` : ''}
                    {s.state ? `, ${s.state}` : ''}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
