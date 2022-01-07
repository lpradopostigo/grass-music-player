const colors = {
  grey: {
    lightest: "#fff",
    100: "#F2F2F7",
    200: "#E5E5EA",
    300: "#D1D1D6",
    400: "#C7C7CC",
    500: "#AEAEB2",
    600: "#8E8E93",
    700: "#636366",
    800: "#48484A",
    900: "#3A3A3C",
    1000: "#2C2C2E",
    darkest: "#1C1C1E",
  },
};

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
