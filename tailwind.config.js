/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        figtree: ['Figtree', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3f2',
          100: '#e9e5e1',
          200: '#d7cfc9',
          300: '#bfb0a6',
          400: '#a38d7e',
          500: '#8b6f5c',
          600: '#7d6354',
          700: '#6a5246',
          800: '#5c473c',
          900: '#4e3c33',
          950: '#2c211c',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          text: '#E0E0E0',
          border: '#333333',
          accent: '#8b705e',
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
