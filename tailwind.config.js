/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,html,scss}"],
  darkMode: "class",
  theme: {
    fontSize: {
      xs: "0.6875rem",
      sm: "0.75rem",
      base: "0.875rem",
      xl: "1rem",
      "2xl": "1.125rem",
      "3xl": "1.25rem",
      "4xl": "1.375rem",
      "5xl": "1.5625rem",
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
        6: "#636366",
        7: "#48484a",
        8: "#3a3a3c",
        9: "#2c2c2e",
        10: "#1c1c1e",
      },
    },
  },
};
