/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#8B5CF6',
        'brand-teal': '#2DD4BF',
        'brand-bg': '#F8FAFC',
      },
      fontFamily: {
        // Aesthetic, rounded font similar to Duolingo
        'rounded': ['"Quicksand"', 'sans-serif'], 
      },
      boxShadow: {
        '3d': '0 8px 0 0 rgba(139, 92, 246, 0.3)',
        '3d-active': '0 2px 0 0 rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}