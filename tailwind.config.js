/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#6b6bec",
        },
      },
    },
    daisyui: {
      themes: [
        {
          light: {
            "primary": "#6b6bec",
            "primary-focus": "#5a5ad9",
            "primary-content": "#ffffff",
            "secondary": "#4a4a9c",
            "secondary-focus": "#3a3a8c",
            "secondary-content": "#ffffff",
            "accent": "#37cdbe",
            "accent-focus": "#2aa79b",
            "accent-content": "#ffffff",
            "base-100": "#ffffff",
            "base-200": "#f5f7ff",
            "base-300": "#e1e5f9",
            "base-content": "#1f2937",
          },
        },
      ],
    },
    plugins: [require("daisyui")],
  }
