import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201c",
        paper: "#fbfaf7",
        leaf: "#1f6f5b",
        clay: "#b85b39",
        saffron: "#e5a31a",
        mist: "#e8ece8",
      },
      boxShadow: {
        soft: "0 20px 70px rgba(23, 32, 28, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
