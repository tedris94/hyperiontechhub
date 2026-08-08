type Block = {
  blockType?: string
  [key: string]: unknown
}

export type { Block }

export function RenderBlocks({ blocks }: { blocks: Block[] | null | undefined }) {
  if (!blocks?.length) return null
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'pageHeader':
            return (
              <div key={index} className="text-center space-y-4">
                <h2 className="text-3xl font-semibold text-[#1B1C1E]">{block.title as string}</h2>
                {typeof block.subtitle === 'string' && block.subtitle ? (
                  <p className="text-gray-600">{block.subtitle}</p>
                ) : null}
              </div>
            )
          case 'richText':
            return (
              <div key={index} className="prose prose-lg">
                <p className="text-gray-700">Rich text content — edit in Payload admin.</p>
              </div>
            )
          case 'featureGrid':
            return (
              <div key={index}>
                <h3 className="text-2xl font-semibold mb-6">{block.heading as string}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {(block.features as Array<{ title?: string; description?: string }>)?.map((f, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{f.title}</h4>
                      <p className="text-gray-600 text-sm">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          case 'ctaBanner':
            return (
              <div key={index} className="bg-[#1A2BC2] text-white rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-2">{block.heading as string}</h3>
                <p>{block.body as string}</p>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
