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
        // Logo Brand Colors (#FF2560 Qurab Rose)
        "primary": "#FF2560",
        "primary-dark": "#D8134B",
        "primary-light": "#FF4D7D",
        "on-primary": "#ffffff",
        "primary-container": "#FFF0F3",
        "on-primary-container": "#BE123C",

        // Secondary & Neutral Tones
        "secondary": "#737373",
        "on-secondary": "#ffffff",
        "secondary-container": "#F5F5F5",
        "on-secondary-container": "#262626",

        // Curated Pastel Palette (Zero Gradients)
        "pastel-rose": "#FFF0F3",
        "pastel-rose-border": "#FECDD3",
        "pastel-rose-text": "#E11D48",

        "pastel-mint": "#EAF7F0",
        "pastel-mint-border": "#C6F0D8",
        "pastel-mint-text": "#1E7E4A",

        "pastel-amber": "#FEF7EA",
        "pastel-amber-border": "#FCE5B8",
        "pastel-amber-text": "#B45309",

        "pastel-sky": "#EEF6FF",
        "pastel-sky-border": "#C9E4FF",
        "pastel-sky-text": "#1D4ED8",

        "pastel-lavender": "#F5F0FF",
        "pastel-lavender-border": "#E5D7FF",
        "pastel-lavender-text": "#7C3AED",

        "pastel-sand": "#FBF9F6",
        "pastel-sand-border": "#EBE5DC",
        "pastel-sand-text": "#57534E",

        // App Surfaces
        "background": "#F9FAFB",
        "on-background": "#171717",
        "surface": "#ffffff",
        "on-surface": "#171717",
        "surface-variant": "#F4F4F5",
        "on-surface-variant": "#52525B",
        "outline": "#E4E4E7",
        "outline-variant": "#F4F4F5",
        "error": "#E11D48",
        "error-container": "#FFF0F3",
      },
      fontFamily: {
        serif: ["'Raleway'", "sans-serif"],
        sans: ["'Raleway'", "'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        arabic: ["'Amiri'", "serif"],
        display: ["'Raleway'", "sans-serif"],
        raleway: ["'Raleway'", "sans-serif"],
      },

      boxShadow: {
        "subtle": "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
        "card": "0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "elevated": "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        "brand": "0 4px 14px rgba(255, 37, 96, 0.22)",
      }
    },
  },
  plugins: [],
}


