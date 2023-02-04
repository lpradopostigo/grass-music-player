import ReleasePicture from "../../components/ReleasePicture/index.jsx";
import classes from "./Release.module.css";
import { A } from "@solidjs/router";

function Release(props) {
  return (
    <A href={`/library/release/${props.id}`}>
      <ReleasePicture class={classes.picture} src={props.src} />
      <div>
        <div class={classes.name}>{props.name}</div>
        <div class={classes.artistCreditName}>{props.artistCreditName}</div>
      </div>
    </A>
  );
}

export default Release;
