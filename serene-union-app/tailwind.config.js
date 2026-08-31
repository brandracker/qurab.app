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
        "primary": "#ff2560",
        "on-primary": "#ffffff",
        "primary-container": "#fff0f4",
        "on-primary-container": "#d91448",
        "secondary": "#64748b",
        "on-secondary": "#ffffff",
        "secondary-container": "#f1f5f9",
        "on-secondary-container": "#334155",
        "tertiary": "#d97706",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#fef3c7",
        "on-tertiary-container": "#92400e",
        "background": "#f8fafc",
        "on-background": "#0f172a",
        "surface": "#ffffff",
        "on-surface": "#0f172a",
        "surface-variant": "#f1f5f9",
        "on-surface-variant": "#475569",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8fafc",
        "surface-container": "#f1f5f9",
        "surface-container-high": "#e2e8f0",
        "surface-container-highest": "#cbd5e1",
        "outline": "#94a3b8",
        "outline-variant": "#e2e8f0",
        "error": "#ef4444",
        "error-container": "#fee2e2",
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
        "ambient": "0 12px 32px rgba(255, 37, 96, 0.08)",
        "card": "0 8px 24px rgba(15, 23, 42, 0.04)",
      }
    },
  },
  plugins: [],
}
