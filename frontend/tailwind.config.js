/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zenith: {
          dark: '#101513',       // Charcoal black
          forest: '#142C25',     // Deep forest green
          forestLight: '#1B3B32',// Lighter forest
          stone: '#D6D1C5',      // Mountain stone
          offwhite: '#F5F5F0',   // Snow white
          accent: '#E68A45',     // Sunrise orange accent
          accentHover: '#CF7634',// Darker accent
          muted: '#8A948F'       // Muted alpine gray
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
