/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'default': '#F0F4F8',
        'table-head': '#8698aa',
        'row-hover': '#1E3059',
        'price-up': '#00b15d',
        'price-down': '#FF5B5A',
        'flash-up': 'rgba(0, 177, 93, 0.5)',
        'flash-down': 'rgba(255, 91, 90, 0.5)',
        'bar-buy':  'rgba(16, 186, 104, 0.12)',
        'bar-sell': 'rgba(255, 90, 90, 0.12)',
        'bar-same': 'rgba(134, 152, 170, 0.12)',
      },
      keyframes: {
        flash: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        flash: 'flash 1s ease-in-out',
      },
    },
  },
  plugins: [],
}

