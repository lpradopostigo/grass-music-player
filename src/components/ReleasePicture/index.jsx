import { Show } from "solid-js";
import classes from "./index.module.css";
import { IoMusicalNote } from "solid-icons/io";
import clsx from "clsx";

function ReleasePicture(props) {
  return (
    <div class={clsx(classes.container, props.class)}>
      <Show
        when={props.src}
        keyed
        fallback={
          <div class={classes.defaultImage}>
            <IoMusicalNote />
          </div>
        }
      >
        <img
          draggable={false}
          src={props.src}
          class={classes.image}
          alt="release picture"
        />
      </Show>
    </div>
  );
}

export default ReleasePicture;
