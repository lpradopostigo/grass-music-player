import ColorContrastChecker from "color-contrast-checker";
import ColorThief from "colorthief";
import theme from "../../theme/theme";
import parsePictureSrc from "../parsePictureSrc";
import { rgbToHex } from "../conversion";

const colorContrastChecker = new ColorContrastChecker();
const colorThief = new ColorThief();

export function getTextColorFromBackground(backgroundColor) {
  const {
    black,
    white,
    fontSizes: { md },
  } = theme;

  return colorContrastChecker.isLevelAAA(black, backgroundColor, md)
    ? black
    : white;
}

export function getDominantColorFromPicture(picture) {
  const parsedPicture = parsePictureSrc(picture);
  return new Promise((resolve) => {
    colorThief.getColorFromUrl(parsedPicture, (color) => {
      resolve(rgbToHex(color));
    });
  });
}
