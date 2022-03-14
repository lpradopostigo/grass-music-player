const colors = {
  blue: [
    "#D2E1F1",
    "#B0CCEB",
    "#8EB9E8",
    "#6CA7E8",
    "#4997EC",
    "#2588F4",
    "#007AFF",
    "#0B6EDA",
    "#1464BB",
    "#195AA1",
  ],

  gray: [
    "#F2F2F7",
    "#E5E5EA",
    "#D1D1D6",
    "#C7C7CC",
    "#AEAEB2",
    "#8E8E93",
    "#636366",
    "#48484A",
    "#3A3A3C",
    "#2C2C2E",
  ],
};
const black = "#1C1C1E";
const white = "#fff";
const primaryColor = "blue";

const fontSizes = {
  xs: 9.72,
  sm: 11.67,
  md: 14,
  lg: 16.8,
  xl: 20.16,
};

const radius = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 8,
  xl: 16,
};

const fontFamily = "Inter";

const theme = {
  fontFamily,
  headings: { fontFamily },
  fontSizes,
  colors,
  primaryColor,
  black,
  white,
  radius,
  other: {
    borderSize: 1,
    borderColor: colors.gray[1],
    accentColor: colors[primaryColor][6],
    textSecondary: colors.gray[6],
  },
};

export default theme;
