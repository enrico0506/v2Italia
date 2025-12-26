import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent2) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,15,20,0.35), 0 0 40px rgba(139,15,20,0.15)",
      },
      backgroundImage: {
        "noise": "radial-gradient(circle at 10% 10%, rgba(255,255,255,0.05), transparent 35%), radial-gradient(circle at 90% 30%, rgba(139,15,20,0.07), transparent 40%), radial-gradient(circle at 30% 90%, rgba(255,255,255,0.04), transparent 30%)",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
