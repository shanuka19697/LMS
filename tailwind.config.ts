import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2563EB", // Blue-600
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#DC2626", // Red-600
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F3F4F6", // Gray-100
          foreground: "#1F2937", // Gray-800
        }
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
