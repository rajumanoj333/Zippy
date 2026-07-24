/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          orange: "#FF6600",
          hover: "#E55C00",
          glow: "rgba(255, 102, 0, 0.15)"
        },
        brand: {
          bg: "#07090E",
          card: "#0E131F",
          border: "rgba(255, 255, 255, 0.07)",
          emerald: "#10B981"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 102, 0, 0.25)',
        'glow-emerald': '0 0 20px -4px rgba(16, 185, 129, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
