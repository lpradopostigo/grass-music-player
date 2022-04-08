import interRegularFontSrc from "../../../assets/fonts/Inter-Regular.ttf";
import interMediumFontSrc from "../../../assets/fonts/Inter-Medium.ttf";
import interSemiBoldFontSrc from "../../../assets/fonts/Inter-SemiBold.ttf";
import interBoldFontSrc from "../../../assets/fonts/Inter-Bold.ttf";
import { titleBarButtonSize } from "../services/constants";

const baseColors = {
  red: [
    "#FAEEED",
    "#F4CAC8",
    "#F1A7A3",
    "#F1837D",
    "#F66057",
    "#FF3B30",
    "#F3291E",
    "#DE2217",
    "#BF261E",
    "#A52922",
    "#8E2A25",
    "#7B2A26",
  ],

  orange: [
    "#F1E4D2",
    "#EBD2B0",
    "#E8C28E",
    "#E8B46C",
    "#ECA849",
    "#F49E25",
    "#FF9500",
    "#DA840B",
    "#BB7514",
    "#A16819",
  ],
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

  yellow: [
    "#F1EBD2",
    "#EBDFB0",
    "#E8D68E",
    "#E8CF6C",
    "#ECCB49",
    "#F4CA25",
    "#FFCC00",
    "#DAB10B",
    "#BB9914",
    "#A18619",
  ],

  green: [
    "#D4E8D9",
    "#B8DCC1",
    "#9CD3AA",
    "#81CD94",
    "#67C980",
    "#4CC86B",
    "#34C759",
    "#35AC53",
    "#35964E",
    "#348348",
  ],

  mint: [
    "#86DAD6",
    "#68D8D3",
    "#4AD9D3",
    "#2BDED6",
    "#17DAD1",
    "#0BD0C7",
    "#00C7BE",
    "#09AAA3",
    "#0F928C",
    "#147D79",
    "#166C68",
  ],

  teal: [
    "#CFE3E7",
    "#B3D5DB",
    "#97CAD3",
    "#7CC0CD",
    "#61BACA",
    "#46B5C9",
    "#30B0C7",
    "#329AAC",
    "#328696",
    "#327682",
  ],

  cyan: [
    "#F5F9FB",
    "#D4E6EF",
    "#B3D6E7",
    "#93C9E2",
    "#73BDE0",
    "#53B4E1",
    "#32ADE6",
    "#259FD7",
    "#2A8CB9",
    "#2C7BA0",
  ],

  indigo: [
    "#EDEDF6",
    "#CECDEA",
    "#B0AFE0",
    "#9291DA",
    "#7574D6",
    "#5856D6",
    "#4745C9",
    "#3F3EB5",
    "#3E3D9E",
    "#37366A",
  ],

  purple: [
    "#F6F1F9",
    "#E3D0ED",
    "#D3B0E4",
    "#C591DF",
    "#B971DD",
    "#AF52DE",
    "#A141D1",
    "#9137BF",
    "#8138A6",
    "#723790",
  ],

  pink: [
    "#FAEAED",
    "#F3C4CD",
    "#F09FAF",
    "#F17A91",
    "#F65473",
    "#FF2D55",
    "#F31B44",
    "#DC173D",
    "#BD1E3C",
    "#A3223A",
  ],

  brown: [
    "#E7E3DF",
    "#D6CFC6",
    "#C7BDB0",
    "#BBAC9A",
    "#B19D85",
    "#A89071",
    "#A2845E",
    "#8F7657",
    "#7E6A51",
    "#705F4B",
    "#635645",
  ],
};

const black = "#1C1C1E";
const white = "#fff";
const primaryColor = "blue";

const colors = {
  accent: baseColors[primaryColor][6],
  border: baseColors.gray[1],
  accentSecondary: baseColors["gray"][0],
};

const baseSpacing = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

const spacingView = baseSpacing.xl + 8;

const spacing = {
  view: spacingView,
  safeView: `${
    spacingView / 2 + titleBarButtonSize.height
  }px ${spacingView}px ${spacingView}px ${spacingView}px`,
};

const fontFamily = "Inter";

const fontSizes = {
  xs: 12.3,
  sm: 13.12,
  md: 14,
  lg: 14.94,
  xl: 15.94,
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
  xs: 3,
  sm: 4,
  md: 5,
  lg: 7,
  xl: 9,
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

export const globalStyles = (theme) => [
  {
    "@font-face": {
      fontFamily: "Inter",
      src: `url('${interRegularFontSrc}')`,
      fontWeight: 400,
    },
  },

  {
    "@font-face": {
      fontFamily: "Inter",
      src: `url('${interMediumFontSrc}')`,
      fontWeight: 500,
    },
  },
  {
    "@font-face": {
      fontFamily: "Inter",
      src: `url('${interSemiBoldFontSrc}')`,
      fontWeight: 600,
    },
  },
  {
    "@font-face": {
      fontFamily: "Inter",
      src: `url('${interBoldFontSrc}')`,
      fontWeight: 700,
    },
  },
  {
    "*,::before,::after": {
      boxSizing: "border-box",
    },
    body: {
      boxSizing: "border-box",
      color: theme.black,
      WebkitUserSelect: "none",
    },
  },
];

export const styles = { Title: { root: { color: "inherit" } } };

export default theme;
