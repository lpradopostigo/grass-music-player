import classes from "./index.module.css";
import TitleBar from "./TitleBar.jsx";

const Shell = (props) => (
  <div class={classes.container}>
    <div>{props.navigationBar}</div>
    <main class={classes.contentWrapper}>
      <TitleBar />
      {props.children}
    </main>
    <div class={classes.miniPlayer}>{props.miniPlayer}</div>
  </div>
);

export default Shell;
