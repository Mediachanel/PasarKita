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
        // Pasar Kita legacy colors
        brown: {
          50: "#FEFAF7",
          100: "#F5EEDE",
          200: "#EDD8C1",
          300: "#E4BEA0",
          400: "#D9A580",
          500: "#C8865C",
          600: "#B8704B",
          700: "#9F5E3F",
          800: "#844D34",
          900: "#6B3E2A",
        },
        beige: "#E8D5C4",
        cream: "#F9F6F0",
        caramel: "#D4A574",
        warmGray: {
          50: "#FAF8F6",
          100: "#F0EAD6",
          200: "#E6DFCC",
          300: "#D5C8B5",
        },
        marketplace: {
          orange: "#f05a2a",
          orangeDark: "#d94d22",
          green: "#03ac0e",
          greenDark: "#028a0f",
          blue: "#0095da",
          blueDark: "#0077b6",
          yellow: "#ffc400",
          ink: "#1f2937",
          muted: "#6b7280",
          line: "#e5e7eb",
          canvas: "#f3f4f6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
