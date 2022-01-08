const colors = require("./src/theme/colors");

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: [
        "Roboto",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
      ],
    },
    colors: {
      ...colors,
      background: {
        primary: colors.grey.lightest,
        secondary: colors.grey["200"],
      },

      border: colors.grey["100"],

      typography: {
        primary: colors.grey.darkest,
        secondary: colors.grey["900"],
        tertiary: colors.grey["700"],
        quaternary: colors.grey["500"],
      },
    },
  },
  plugins: [],
  purge: false,
};
