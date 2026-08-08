import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { RenderBlocks, type Block } from '@/components/RenderBlocks'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params

  if (!isPayloadEnabled()) {
    notFound()
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
    })

    const page = result.docs[0]
    if (!page) notFound()

    const featuredImage =
      page.featuredImage && typeof page.featuredImage === 'object' && 'url' in page.featuredImage
        ? (page.featuredImage.url as string)
        : undefined

    return (
      <main className="min-h-screen pt-20">
        <Header />
        <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E]">{page.title}</h1>
              {page.excerpt && <p className="text-xl text-gray-600 leading-relaxed">{page.excerpt}</p>}
            </div>
          </div>
        </section>

        {featuredImage && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="relative h-[360px] rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
                <Image src={featuredImage} alt={page.title || ''} fill className="object-cover" sizes="80vw" />
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            {Array.isArray(page.layout) && page.layout.length > 0 ? (
              <RenderBlocks blocks={page.layout as Block[]} />
            ) : (
              <div className="prose prose-lg max-w-4xl mx-auto">
                <p>{page.excerpt || 'Content coming soon.'}</p>
              </div>
            )}
          </div>
        </section>
        <Footer />
        <BackToTop />
      </main>
    )
  } catch {
    notFound()
  }
}
