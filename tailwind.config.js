/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'snake': '#4ade80',
        'snake-dark': '#22c55e',
        'food': '#f87171',
        'food-glow': '#ef4444',
        'board': '#1e293b',
        'board-lines': '#334155',
      },
      animation: {
        'pulse-food': 'pulse-food 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'game-over': 'game-over 0.5s ease-out',
      },
      keyframes: {
        'pulse-food': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        'game-over': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}