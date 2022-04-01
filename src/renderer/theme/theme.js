import { titleBarButtonSize } from "../services/constants";

const baseColors = {
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

const colors = {
  accent: baseColors[primaryColor][6],
  border: baseColors.gray[1],
  accentSecondary: baseColors[primaryColor][0],
};

const baseSpacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};

const spacing = {
  view: 32,
  safeView: `${
    baseSpacing.lg + titleBarButtonSize.height
  }px ${32}px ${32}px ${32}px`,
};

const fontFamily = "Inter";

const fontSizes = {
  xs: 12.3,
  sm: 13.12,
  md: 14,
  lg: 17.5,
  xl: 21.88,
};

const headings = {
  fontFamily,
  sizes: {
    h1: { fontSize: 27.34 },
    h2: { fontSize: fontSizes.xl },
    h3: { fontSize: fontSizes.lg },

    h4: { fontSize: fontSizes.md },
    h5: { fontSize: fontSizes.sm },
    h6: { fontSize: fontSizes.xs },
  },
};

const radius = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
};

const theme = {
  fontFamily,
  headings,
  fontSizes,
  colors: baseColors,
  primaryColor,
  black,
  white,
  radius,
  spacing: baseSpacing,
  other: {
    borderSize: 1,
    borderColor: baseColors.gray[1],
    accentColor: baseColors[primaryColor][6],
    textSecondary: baseColors.gray[6],
    colors,
    spacing,
  },
};

export const styles = { Title: { root: { color: "inherit" } } };

export default theme;
