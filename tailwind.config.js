/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          dark: '#07120c',
          green: '#0e2d1e',
          accent: '#05c46b',
          gold: '#ffb300'
        }
      }
    },
  },
  plugins: [],
}
