/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
      fontSize: {
        '18': '18px',
        '56': '56px',
        '24': '24px',
        '20': '20px',
        '22': '22px',
        '48': '48px',
        '32': '32px',
        '36': '36px',
      }
    },
  },

  plugins: [],
}