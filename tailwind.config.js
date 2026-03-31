/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        card: '#1a1a1a',
        accent: '#ff3b30',
        brand: {
          green: '#4ade80',
          yellow: '#facc15',
          red: '#f87171',
          darkRed: '#991b1b',
        }
      },
    },
  },
  plugins: [],
}
