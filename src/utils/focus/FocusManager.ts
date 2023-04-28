import {
  FocusableElement,
  FocusManagerOptions,
  isElementInScope,
  isElementVisible,
  getFocusableTreeWalker,
  last,
} from "./utils";

class FocusManager {
  #root: Element | null | undefined;
  #defaultOptions: FocusManagerOptions;

  constructor(
    root: Element | null | undefined,
    defaultOptions: FocusManagerOptions = {}
  ) {
    this.#root = root;
    this.#defaultOptions = defaultOptions;
  }

  focusNext(opts: FocusManagerOptions = {}) {
    if (!this.#root) {
      return;
    }
    let {
      from,
      tabbable = this.#defaultOptions.tabbable,
      wrap = this.#defaultOptions.wrap,
      accept = this.#defaultOptions.accept,
    } = opts;
    let node = from || document.activeElement;
    let walker = getFocusableTreeWalker(this.#root, {
      tabbable,
      accept,
    });
    if (this.#root.contains(node)) {
      walker.currentNode = node as Node;
    }
    let nextNode = walker.nextNode() as FocusableElement | null;
    if (!nextNode && wrap) {
      walker.currentNode = this.#root;
      nextNode = walker.nextNode() as FocusableElement | null;
    }
    if (nextNode) {
      nextNode.focus();
    }
    return nextNode;
  }

  focusPrevious(opts: FocusManagerOptions = this.#defaultOptions) {
    if (!this.#root) {
      return;
    }
    const {
      from,
      tabbable = this.#defaultOptions.tabbable,
      wrap = this.#defaultOptions.wrap,
      accept = this.#defaultOptions.accept,
    } = opts;
    const node = from || document.activeElement;
    const walker = getFocusableTreeWalker(this.#root, {
      tabbable,
      accept,
    });
    if (this.#root.contains(node)) {
      walker.currentNode = node as Node;
    } else {
      let next = last(walker);
      if (next) {
        next.focus();
      }
      return next;
    }
    let previousNode = walker.previousNode() as FocusableElement | null;
    if (!previousNode && wrap) {
      walker.currentNode = this.#root;
      previousNode = last(walker);
    }
    if (previousNode) {
      previousNode?.focus();
    }
    return previousNode;
  }

  focusFirst(opts = this.#defaultOptions) {
    if (!this.#root) {
      return;
    }
    const {
      tabbable = this.#defaultOptions.tabbable,
      accept = this.#defaultOptions.accept,
    } = opts;
    const walker = getFocusableTreeWalker(this.#root, {
      tabbable,
      accept,
    });
    const nextNode = walker.nextNode() as FocusableElement | null;
    if (nextNode) {
      nextNode.focus();
    }
    return nextNode;
  }

  focusLast(opts = this.#defaultOptions) {
    if (!this.#root) {
      return;
    }
    const {
      tabbable = this.#defaultOptions.tabbable,
      accept = this.#defaultOptions.accept,
    } = opts;
    const walker = getFocusableTreeWalker(this.#root, {
      tabbable,
      accept,
    });
    const next = last(walker);
    if (next) {
      next.focus();
    }
    return next;
  }
}

export default FocusManager;
