import { createEffect, mergeProps, Show } from "solid-js";
import classes from "./index.module.css";
import clsx from "clsx";
import { IoMusicalNote } from "solid-icons/io";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

function CoverArt(props: CoverArtProps) {
  const defaultedProps = mergeProps({ size: "md" }, props);
  const visible = createVisibilityObserver()(() => containerEl);
  let containerEl!: HTMLDivElement;
  let imgEl: HTMLImageElement | undefined;

  createEffect(() => {
    if (visible() && imgEl && !imgEl.src) {
      imgEl.src = defaultedProps.src || "";
    }
  });

  return (
    <div
      ref={containerEl}
      class={clsx(
        {
          [classes.sizeSm]: defaultedProps.size === "sm",
          [classes.sizeMd]: defaultedProps.size === "md",
        },
        defaultedProps.class
      )}
    >
      <Show
        when={defaultedProps.src}
        keyed
        fallback={
          <div class={classes.default}>
            <IoMusicalNote />
          </div>
        }
      >
        <img
          ref={imgEl}
          src={defaultedProps.lazy ? undefined : defaultedProps.src}
          draggable={false}
          class={clsx(classes.image, defaultedProps.imgClass)}
          alt="cover art"
        />
      </Show>
    </div>
  );
}

type CoverArtProps = {
  src?: string;
  size?: "sm" | "md";
  class?: string;
  imgClass?: string;
  lazy?: boolean;
};

export default CoverArt;
