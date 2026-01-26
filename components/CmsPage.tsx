import Image from 'next/image';
import { getPage } from '@/lib/wp-api';

interface CmsPageProps {
  slug: string;
  titleFallback: string;
  descriptionFallback?: string;
}

export default async function CmsPage({
  slug,
  titleFallback,
  descriptionFallback,
}: CmsPageProps) {
  const page = await getPage(slug);
  const title = page?.title?.rendered || titleFallback;
  const content = page?.content?.rendered || '';
  const description =
    page?.excerpt?.rendered || descriptionFallback || 'Content coming soon.';
  const featuredImage = page?.featured_image_url;

  return (
    <main className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div
              className="text-xl text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </section>

      {featuredImage && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="relative h-[360px] rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
              <Image
                src={featuredImage}
                alt={titleFallback}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className="prose prose-lg max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: content || `<p>${descriptionFallback || 'Content coming soon.'}</p>`,
            }}
          />
        </div>
      </section>
    </main>
  );
}
