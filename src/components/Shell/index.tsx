import classes from "./index.module.css";
import TitleBar from "./TitleBar";
import { JSX } from "solid-js";

function Shell(props: ShellProps) {
  return (
    <div class={classes.container}>
      <div>{props.navigationBar}</div>
      <main class={classes.contentWrapper}>
        <TitleBar />
        {props.children}
      </main>
      <div class={classes.miniPlayer}>{props.miniPlayer}</div>
    </div>
  );
}

type ShellProps = {
  navigationBar: JSX.Element;
  miniPlayer: JSX.Element;
  children: JSX.Element;
};

export default Shell;
