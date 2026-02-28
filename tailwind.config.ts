import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a7ea4",
        secondary: "#EC4899",
        accent: "#F59E0B",
        highlight: "#10B981",
        error: "#EF4444",
        background: {
          light: "#FFFFFF",
          dark: "#151718",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
        },
        border: "#E5E7EB",
      },
    },
  },
  plugins: [],
} satisfies Config;
