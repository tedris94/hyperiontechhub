import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const out = path.resolve('public/assets/portfolio')
const logo = path.resolve('public/assets/clients/model-islamic.png')

const W = 1280
const H = 800
const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F5F7FB"/>
      <stop offset="100%" stop-color="#E8ECF8"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="80" y="90" width="520" height="620" rx="24" fill="#ffffff" stroke="#D7DCEE"/>
  <rect x="640" y="0" width="640" height="800" fill="#0D1B4C"/>
  <text x="120" y="180" font-family="Georgia, serif" font-size="36" fill="#0D1B4C">Welcome back</text>
  <text x="120" y="230" font-family="Arial, sans-serif" font-size="18" fill="#5B6475">Sign in to your account</text>
  <rect x="120" y="280" width="440" height="52" rx="10" fill="#F3F5FA" stroke="#D7DCEE"/>
  <rect x="120" y="360" width="440" height="52" rx="10" fill="#F3F5FA" stroke="#D7DCEE"/>
  <rect x="120" y="450" width="440" height="52" rx="10" fill="#1A2BC2"/>
  <text x="290" y="483" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#ffffff">Sign In</text>
</svg>`)

const logoBuf = await sharp(logo)
  .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

await sharp(bg)
  .composite([{ input: logoBuf, left: 850, top: 290 }])
  .png()
  .toFile(path.join(out, 'model-islamic-preview.png'))

console.log('wrote model-islamic-preview.png', fs.statSync(path.join(out, 'model-islamic-preview.png')).size)
