/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react"); // ✅ Import HeroUI Tailwind preset

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#010326", // Dark Blue
        secondary: "#07B0F2", // Light Blue
        success: "#0DA64F", // Green
        warning: "#F2B138", // Yellow
        danger: "#F25922", // Orange
      },
    },
  },
  plugins: [heroui()],
};
