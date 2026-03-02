import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a7ea4", // Light theme primary/tint
        secondary: "#EC4899",
        accent: "#F59E0B",
        highlight: "#10B981",
        error: "#EF4444",
        "brand-blue": "#007AFF", // Apple Blue
        "brand-red": "#FF3B30", // Apple Red
        "brand-green": "#34C759", // Apple Green
        "dark-primary": "#ffffff", // Dark theme primary/tint
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#151718",
        },
        text: {
          DEFAULT: "#11181C",
          dark: "#ECEDEE",
          secondary: "#6B7280",
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#333333",
        },
        // Gradient palettes as mentioned
        "rose-dark": "#881337",
        "orange-dark": "#7c2d12",
        "yellow-dark": "#713f12",
        "emerald-dark": "#064e3b",
        "cyan-dark": "#134e4a",
        "indigo-dark": "#312e81",
        "fuchsia-dark": "#701a75",
        "zinc-50": "#fafafa",
        "zinc-100": "#f4f4f5",
        "zinc-200": "#e4e4e7",
        "zinc-300": "#d4d4d8",
        "zinc-400": "#a1a1aa",
        "zinc-500": "#71717a",
        "zinc-600": "#52525b",
        "zinc-700": "#3f3f46",
        "zinc-800": "#27272a",
        "zinc-900": "#18181b",
        "zinc-950": "#09090b",
      },
    },
  },
  plugins: [],
} satisfies Config;
