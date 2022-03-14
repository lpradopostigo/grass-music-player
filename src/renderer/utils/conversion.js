export function valueToPercentage(value, referenceValue) {
  return (value / referenceValue) * 100;
}

export function percentageToValue(percentage, referenceValue) {
  return (percentage * referenceValue) / 100;
}

export function rgbToHex(rgb) {
  const hexBase = 16;

  const parseDecimalPart = (number) => {
    const hex = number.toString(hexBase);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return rgb.reduce((accum, value) => accum + parseDecimalPart(value), "#");
}

export function pxToRem(px) {
  return `${typeof px === "string" ? parseFloat(px) : px / 16}rem`;
}
