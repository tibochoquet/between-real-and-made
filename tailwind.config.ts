import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: "#F7F3EC",
          light: "#FAF7F2",
          dark: "#EDE7D9",
        },
        brown: {
          DEFAULT: "#1C0F0A",
          mid: "#3D2317",
          light: "#6B4132",
          muted: "#9C7A6A",
        },
        terracotta: {
          DEFAULT: "#C4714A",
          light: "#D4916F",
          dark: "#A85A35",
          muted: "#D4A88A",
        },
        cream: "#FFF8F0",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.3em",
        wider: "0.15em",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
