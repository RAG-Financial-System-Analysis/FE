/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#1773cf",
        "background-light": "#f6f7f8",
        "background-dark": "#111921",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
