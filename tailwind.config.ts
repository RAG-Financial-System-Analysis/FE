import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B2C4F', // Dark blue from the screenshot
          light: '#2A4069',
          dark: '#121F3A',
        },
        accent: {
          DEFAULT: '#ffffff',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
      }
    }
  },
  plugins: []
} satisfies Config
