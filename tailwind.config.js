/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#F3F7EB",
          100: "#D9E6C0",
          200: "#C7D9A1",
          300: "#ADC876",
          400: "#9DBD5C",
          500: "#85AD33",
          600: "#799D2E",
        },
        blue: {
          50: "#EBF0FA",
          500: "#3366CC",
        },
        grey: { 800: "#111111" },
      },
      backgroundImage: {
        "hero-pattern": "url('https://i.ibb.co/s2PKJm4/hero.jpg')",
        boat: "url('https://i.ibb.co/VwS3Hb7/boat.jpg')",
      },
      fontFamily: { poppins: ["Poppins", "sans-serif"] },
    },
  },
  plugins: [],
};
