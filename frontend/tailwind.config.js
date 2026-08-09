/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        secondary: "#666666",
        background: "#FFFFFF",
        surface: "#F7F7F7",
        accent: "#FF4C3B",
        border: "#EEEEEE",
        error: "#FF4444",
      },
    },
  },
  plugins: [],
};
