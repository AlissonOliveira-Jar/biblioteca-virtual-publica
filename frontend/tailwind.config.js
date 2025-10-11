/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
      },
      keyframes: {
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 25px rgba(124, 58, 237, 0.7)' },
        }
      },
      animation: {
        'gradient-flow': 'gradient-flow 3s ease infinite',
        breathe: 'breathe 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
