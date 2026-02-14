/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF6F0",
        blush: "#F7D6E6",
        rose: "#F4B8D2",
        ink: "#2B2B2B"
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.08)"
      }
    },
  },
  plugins: [],
}
