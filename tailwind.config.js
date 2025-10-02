/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
      borderWidth: {
        1: "1px",
      },
      spacing: {
        2.5: "0.625rem",
      },
      gap: {
        "y-6": "1.5rem",
      },
    },
  },
  plugins: [],
};
