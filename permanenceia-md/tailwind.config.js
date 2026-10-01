/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4ECDC4',
          hover: '#3dbbb2',
          light: '#A8D5D5',
          soft: '#E8F8F7',
          dark: '#3bb5ad',
        },
        navy: {
          DEFAULT: '#1A2332',
          dark: '#0F1419',
          light: '#243044',
          subtle: '#2a3b50',
        },
        accent: {
          DEFAULT: '#A8D5D5',
          glow: '#5FE0DB',
        },
        ink: {
          DEFAULT: '#1A2332',
          muted: '#6B7A8B',
          lightMuted: '#9AA7B5',
          inverted: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'brand': '0 12px 30px -10px rgba(26, 35, 50, 0.12)',
        'brand-hover': '0 20px 40px -12px rgba(78, 205, 196, 0.25)',
        'dark-brand': '0 12px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
