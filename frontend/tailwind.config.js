/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./build/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5a4",   // teal-ish
        secondary: "#064e3b", // dark green
        accent: "#f59e0b"     // amber
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial"]
      },
      boxShadow: {
        card: "0 6px 20px rgba(12, 22, 28, 0.08)"
      },
      borderRadius: {
        lg: "0.75rem"
      }
    }
  },
  plugins: []
}

