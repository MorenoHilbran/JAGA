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
        "surface": "#080B24",
        "surface-container-lowest": "#080B24",
        "surface-container-low": "#0D1130",
        "surface-container": "#131735",
        "surface-container-high": "#1C2248",
        "surface-container-highest": "#283060",
        "surface-variant": "#222749",
        "surface-bright": "#22274c",
        "primary": "#c6ffda",
        "primary-container": "#35F2A0",
        "primary-accent": "#8BFFCE",
        "primary-fixed": "#51ffad",
        "on-primary-container": "#00472b",
        "secondary": "#c1c4ec",
        "secondary-container": "#2f3559",
        "on-secondary": "#2a2e4e",
        "on-secondary-container": "#afb2da",
        "error": "#FF5C67",
        "error-container": "#481016",
        "error-accent": "#FF5C67",
        "on-surface": "#dfe0ff",
        "on-surface-variant": "#9ca7c5",
        "outline": "#859588",
        "outline-variant": "#2c345b",
        "inverse-surface": "#dfe0ff",
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "sm": "0.125rem",
        "md": "0.25rem",
        "lg": "0.375rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "1rem",
        "gutter-desktop": "1.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "margin-desktop": "2rem"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
}
