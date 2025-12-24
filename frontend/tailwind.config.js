/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "geo-green": "#2E7D32",
        "geo-dark": "#1a1a1a",
      },
    },
  },
  plugins: [],
};
