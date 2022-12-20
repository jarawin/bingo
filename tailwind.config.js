/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      purp: "#6e27c5",
      yell: "#ffb617",
      pink: "#ff0199",
      gray: "#afafaf",
      white: "#ffffff",
      black: "#000000",
      gray: colors.trueGray,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
      sky: colors.sky,
      teal: colors.teal,
      cyan: colors.cyan,
      orange: colors.orange,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
