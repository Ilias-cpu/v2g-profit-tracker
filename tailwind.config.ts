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
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#1a6ff4',
          dark:    '#1259d6',
          light:   '#e8f0fe',
          mid:     '#d0e3ff',
        },
        bg: '#fafafa',
      },
      boxShadow: {
        card:    '0 4px 24px rgba(26,111,244,0.10)',
        'card-lg': '0 8px 40px rgba(26,111,244,0.15)',
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
}

export default config
