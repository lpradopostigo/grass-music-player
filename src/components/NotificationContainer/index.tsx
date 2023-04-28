import { ParentComponent, JSX } from "solid-js";
import classes from "./index.module.css";

const NotificationContainer: ParentComponent<NotificationProps> = (props) => {
  return <div class={classes.container}>{props.children}</div>;
};

type NotificationProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, "role">;

export default NotificationContainer;
