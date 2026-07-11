import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#161715",
          900: "#1f2119",
          800: "#2a2d23",
        },
        olive: {
          400: "#8a9470",
          500: "#6b7454",
          600: "#4a5240",
          700: "#3a4032",
        },
        rust: {
          400: "#d3925a",
          500: "#b8763a",
          600: "#96602e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
