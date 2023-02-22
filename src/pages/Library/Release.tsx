import CoverArt from "../../components/CoverArt";
import classes from "./Release.module.css";
import { A } from "@solidjs/router";

function Release(props: ReleaseProps) {
  return (
    <A
      tabIndex={-1}
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

type ReleaseProps = {
  id: string;
  src?: string;
  name: string;
  artistCreditName: string;
};

export default Release;
