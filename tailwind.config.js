/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          yellow: '#FFD700',
          white: '#FFFFFF',
          card: '#0a0a0a',
          raised: '#121212',
          border: '#1a1a1a',
          textMuted: '#a0a0a0',
          textDim: '#505050',
        }
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'yellow-glow': '0 0 24px rgba(255,215,0,0.3)',
      }
    },
  },
  plugins: [],
}
