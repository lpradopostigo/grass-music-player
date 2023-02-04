import classes from "./index.module.css";

const Shell = (props) => (
  <div class={classes.container}>
    <div>{props.navigationBar}</div>
    <main class={classes.contentWrapper}>{props.children}</main>
    <div class={classes.miniPlayer}>{props.miniPlayer}</div>
  </div>
);

export default Shell;
