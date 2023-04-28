import { JSX } from "solid-js";

declare global {
  type ComponentCommonProps = Pick<
    JSX.HTMLAttributes<HTMLElement>,
    "class" | "style" | "tabIndex"
  >;
}
