/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./resources/js/**/*.jsx",
        "./resources/js/**/*.tsx",
    ],
    theme: {
        colors: {
            davidiciGold: "#D1AA68",
            gray: colors.gray,
            white: colors.white,
            red: colors.red,
            black: colors.black,
            orange: colors.orange,
        },
        extend: {},
    },
    plugins: [],
};
