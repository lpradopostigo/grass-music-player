/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,html,scss}"],
  darkMode: "class",
  theme: {
    fontSize: {
      xs: "0.6875rem",
      sm: "0.75rem",
      base: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.375rem",
      "4xl": "1.5625rem",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      height: {
        "cover-art-sm": 48,
        "cover-art-md": 128,
        "cover-art-lg": 256,
      },

      width: {
        "cover-art-sm": 48,
        "cover-art-md": 128,
        "cover-art-lg": 256,
      },
    },

    colors: {
      black: "#000",
      white: "#fff",
      gray: {
        0: "#f2f2f7",
        1: "#e5e5ea",
        2: "#d1d1d6",
        3: "#c7c7cc",
        4: "#aeaeb2",
        5: "#8e8e93",
      },
      placeholder: "#8e8e93",
    },
  },
};
