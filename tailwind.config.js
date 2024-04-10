/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
    './resources/js/**/*.jsx',
  ],
  theme: {
    colors: {
      davidiciGold:'#D1AA68',
      gray: colors.gray,
      white: colors.white,
    },
    extend: {},
  },
  plugins: [],
}

