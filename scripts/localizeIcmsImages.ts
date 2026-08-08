/**
 * Download remote Unsplash (etc.) images used by ICMS and convert to AVIF under public/icms/media.
 * Usage: npx tsx scripts/localizeIcmsImages.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'icms', 'media')

const ASSETS: { id: string; url: string; width: number }[] = [
  {
    id: 'photo-1542414110',
    url: 'https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?w=1200&h=800&fit=crop&auto=format',
    width: 1200,
  },
  {
    id: 'photo-1606981693736',
    url: 'https://images.unsplash.com/photo-1606981693736-62d6c4954ba5?w=1200&h=800&fit=crop&auto=format',
    width: 1200,
  },
  {
    id: 'photo-1558114965',
    url: 'https://images.unsplash.com/photo-1558114965-eeb97aa84c3b?w=1200&h=800&fit=crop&auto=format',
    width: 1200,
  },
  {
    id: 'photo-1521241191669',
    url: 'https://images.unsplash.com/photo-1521241191669-b9fba071b073?w=1200&h=800&fit=crop&auto=format',
    width: 1200,
  },
  {
    id: 'photo-1698967406711',
    url: 'https://images.unsplash.com/photo-1698967406711-ede239b6c07e?w=1200&h=800&fit=crop&auto=format',
    width: 1200,
  },
  {
    id: 'photo-1609599006353',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=800&fit=crop&auto=format',
    width: 1200,
  },
  {
    id: 'photo-1564769625905',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&h=1600&fit=crop&auto=format',
    width: 1600,
  },
]

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  console.log('Writing AVIF assets to', outDir)

  for (const asset of ASSETS) {
    const dest = path.join(outDir, `${asset.id}.avif`)
    process.stdout.write(`→ ${asset.id} … `)
    const res = await fetch(asset.url, {
      headers: { 'User-Agent': 'HyperionICMS/1.0 (local asset mirror)' },
    })
    if (!res.ok) {
      console.log(`FAILED ${res.status}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    await sharp(buf)
      .rotate()
      .resize({ width: asset.width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 4 })
      .toFile(dest)
    const size = fs.statSync(dest).size
    console.log(`OK (${Math.round(size / 1024)} KB)`)
  }

  console.log('Done. Use paths like /icms/media/photo-1542414110.avif')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
