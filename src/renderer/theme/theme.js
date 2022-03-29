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

const fontFamily = "Inter";

const fontSizes = {
  xs: 9.72,
  sm: 11.67,
  md: 14,
  lg: 16.8,
  xl: 20.16,
};

const headings = {
  fontFamily,
  sizes: {
    h1: { fontSize: 32.84 },
    h2: { fontSize: 29.03 },
    h3: { fontSize: 24.19 },
    h4: { fontSize: fontSizes.xl },
    h5: { fontSize: fontSizes.lg },
    h6: { fontSize: fontSizes.md },
  },
};

const radius = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 8,
  xl: 16,
};

const theme = {
  fontFamily,
  headings,
  fontSizes,
  colors,
  primaryColor,
  black,
  white,
  radius,
  other: {
    borderSize: 1,
    borderColor: colors.gray[0],
    accentColor: colors[primaryColor][6],
    textSecondary: colors.gray[6],
  },
};

export const styles = { Title: { root: { color: "inherit" } } };

export default theme;
