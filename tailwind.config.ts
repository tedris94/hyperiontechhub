import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        clinton: ['Clinton', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1A2BC2',
          hover: '#0D0D52',
        },
      },
      fontSize: {
        'hero-desktop': ['64px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'section-desktop': ['48px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'section-mobile': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subsection-desktop': ['28px', { lineHeight: '1.4' }],
        'subsection-mobile': ['24px', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
}
export default config

