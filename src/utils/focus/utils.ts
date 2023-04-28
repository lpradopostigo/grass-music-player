function getFocusableTreeWalker(
  root: Element,
  opts?: FocusManagerOptions,
  scope?: Element[]
) {
  let selector = opts?.tabbable
    ? tabbableElementSelector
    : focusableElementSelector;
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      // Skip nodes inside the starting node.
      if (opts?.from?.contains(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      if (
        (node as Element).matches(selector) &&
        isElementVisible(node as Element) &&
        (!scope || isElementInScope(node as Element, scope)) &&
        (!opts?.accept || opts.accept(node as Element))
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_SKIP;
    },
  });

  if (opts?.from) {
    walker.currentNode = opts.from;
  }

  return walker;
}

function last(walker: TreeWalker) {
  let next: FocusableElement | null = null;
  let last: FocusableElement | null = null;
  do {
    last = walker.lastChild() as FocusableElement | null;
    if (last) {
      next = last;
    }
  } while (last);
  return next;
}

function isStyleVisible(element: Element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    return false;
  }

  let { display, visibility } = element.style;

  let isVisible =
    display !== "none" && visibility !== "hidden" && visibility !== "collapse";

  if (isVisible) {
    const { getComputedStyle } = element.ownerDocument.defaultView!;
    let { display: computedDisplay, visibility: computedVisibility } =
      getComputedStyle(element);

    isVisible =
      computedDisplay !== "none" &&
      computedVisibility !== "hidden" &&
      computedVisibility !== "collapse";
  }

  return isVisible;
}

function isAttributeVisible(element: Element, childElement?: Element) {
  return (
    !element.hasAttribute("hidden") &&
    (element.nodeName === "DETAILS" &&
    childElement &&
    childElement.nodeName !== "SUMMARY"
      ? element.hasAttribute("open")
      : true)
  );
}

function isElementVisible(element: Element, childElement?: Element): boolean {
  return (
    element.nodeName !== "#comment" &&
    isStyleVisible(element) &&
    isAttributeVisible(element, childElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  );
}

function isElementInScope(element: Element, scope: Element[]) {
  return scope.some((node) => node.contains(element));
}

type FocusableElement = Element & HTMLElement & SVGElement;

type FocusManagerOptions = {
  /**
   * The element to start searching from. The currently focused element by
   * default.
   */
  from?: Element;
  /** Whether to only include tabbable elements, or all focusable elements. */
  tabbable?: boolean;
  /** Whether focus should wrap around when it reaches the end of the scope. */
  wrap?: boolean;
  /** A callback that determines whether the given element is focused. */
  accept?: (node: Element) => boolean;
};

const focusableElements = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]",
];

const tabbableElementSelector = focusableElements.join(
  ':not([hidden]):not([tabindex="-1"]),'
);

const focusableElementSelector =
  focusableElements.join(":not([hidden]),") +
  ",[tabindex]:not([disabled]):not([hidden])";

export type { FocusManagerOptions, FocusableElement };

export { isElementInScope, isElementVisible, getFocusableTreeWalker, last };
