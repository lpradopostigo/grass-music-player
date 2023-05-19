const savedPositions: Record<string, number> = {};
let autoFocusIsPrevented = false;

function getGridSize(element: HTMLDivElement) {
  const computedStyle = getComputedStyle(element);
  const columns = computedStyle
    .getPropertyValue("grid-template-columns")
    .replace(" 0px", "")
    .split(" ").length;
  const rows = Math.ceil(element.children.length / columns);

  return { columns, rows };
}

function preventAutoFocus() {
  autoFocusIsPrevented = true;
}

function allowAutoFocus() {
  autoFocusIsPrevented = false;
}

export {
  savedPositions,
  getGridSize,
  preventAutoFocus,
  allowAutoFocus,
  autoFocusIsPrevented,
};
