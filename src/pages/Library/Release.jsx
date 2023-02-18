import CoverArt from "../../components/CoverArt/index.jsx";
import classes from "./Release.module.css";
import { A } from "@solidjs/router";

function Release(props) {
  return (
    <A
      tabIndex={-1}
      ref={props.ref}
      href={`/library/release/${props.id}`}
      class={classes.container}
    >
      <CoverArt lazy class={classes.picture} src={props.src} />
      <div>
        <div class={classes.name}>{props.name}</div>
        <div class={classes.artistCreditName}>{props.artistCreditName}</div>
      </div>
    </A>
  );
}

export default Release;
