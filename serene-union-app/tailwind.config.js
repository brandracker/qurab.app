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
        "primary": "#154212",
        "on-primary": "#ffffff",
        "primary-container": "#2d5a27",
        "on-primary-container": "#9dd090",
        "secondary": "#4f6073",
        "on-secondary": "#ffffff",
        "secondary-container": "#d2e4fb",
        "on-secondary-container": "#556679",
        "tertiary": "#735c00",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#cca730",
        "on-tertiary-container": "#4f3d00",
        "background": "#fbf9f4",
        "on-background": "#1b1c19",
        "surface": "#fbf9f4",
        "on-surface": "#1b1c19",
        "surface-variant": "#e4e2dd",
        "on-surface-variant": "#42493e",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3ee",
        "surface-container": "#f0eee9",
        "surface-container-high": "#eae8e3",
        "surface-container-highest": "#e4e2dd",
        "outline": "#72796e",
        "outline-variant": "#c2c9bb",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      spacing: {
        "max-width": "480px",
        "container-padding": "24px",
        "section-gap": "40px",
        "stack-gap": "16px",
      },
      boxShadow: {
        "ambient": "0 12px 32px rgba(21, 66, 18, 0.08)",
        "card": "0 8px 24px rgba(0, 0, 0, 0.04)",
      }
    },
  },
  plugins: [],
}
