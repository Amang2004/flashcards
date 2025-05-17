/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#8a5cf5', // Purple color as seen in the design
        'primary-dark': '#6d46c2',
        'dark': {
          '900': '#0a0a0f', // Background
          '800': '#111827', // Card background
          '700': '#1f2937', // Lighter elements
        }
      }
    },
  },
  plugins: [],
} 