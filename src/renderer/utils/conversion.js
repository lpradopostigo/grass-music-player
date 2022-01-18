export function valueToPercentage(value, referenceValue) {
  return (value / referenceValue) * 100;
}

export function percentageToValue(percentage, referenceValue) {
  return (percentage * referenceValue) / 100;
}
