import classes from "./EqBars.module.css";
import clsx from "clsx";

function EqBars() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
    >
      <rect
        class={clsx(classes.eqBar, classes.eqBar1)}
        x="4"
        y="4"
        width="3.7"
        height="8"
      />
      <rect
        class={clsx(classes.eqBar, classes.eqBar2)}
        x="10.2"
        y="4"
        width="3.7"
        height="16"
      />
      <rect
        class={clsx(classes.eqBar, classes.eqBar3)}
        x="16.3"
        y="4"
        width="3.7"
        height="11"
      />
    </svg>
  );
}

export default EqBars;
