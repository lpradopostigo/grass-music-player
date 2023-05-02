import { createEffect, For, mergeProps, Show } from "solid-js";
import clsx from "clsx";
import Icon from "./Icon";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

function CoverArt(props: CoverArtProps) {
  const localProps = mergeProps(
    {
      size: "md",
      srcs: [] as string[],
    },
    props
  );

  let containerEl: HTMLDivElement;

  const isVisible = createVisibilityObserver()(() => containerEl);

  createEffect(() => {
    if (
      isVisible() &&
      localProps.srcs.length &&
      containerEl?.children.length !== 0
    ) {
      for (const child of Array.from(containerEl.children)) {
        if (child instanceof HTMLImageElement) {
          child.src = child.dataset.src!;
        }
      }
    }
  });

  const srcs = () => localProps.srcs.slice(0, maxSrcs);
  const columns = () => Math.max(srcs().length, 1);

  return (
    <div
      ref={containerEl!}
      class={clsx(
        "grid grid-rows-1 gap-0.5 shadow",
        {
          "h-cover-art-sm w-cover-art-sm": localProps.size === "sm",
          "h-cover-art-md w-cover-art-md": localProps.size === "md",
          "h-cover-art-lg w-cover-art-lg": localProps.size === "lg",
        },
        props.class
      )}
      style={{
        "grid-template-columns": `repeat(${columns()}, 1fr)`,
      }}
    >
      <Show
        when={srcs().length === 0}
        fallback={
          <For each={srcs()}>
            {(src) => (
              <img
                class="h-full w-full overflow-hidden object-cover"
                data-src={src}
                alt="cover art"
                src=""
              />
            )}
          </For>
        }
      >
        <div
          class={clsx("grid place-content-center bg-black text-white", {
            "text-[24px]": localProps.size === "sm",
            "text-[40px]": localProps.size === "md",
            "text-[64px]": localProps.size === "lg",
          })}
        >
          <Icon name="music-notes" />
        </div>
      </Show>
    </div>
  );
}

const maxSrcs = 3;

type CoverArtProps = {
  srcs?: string[];
  size?: "sm" | "md" | "lg";
} & Pick<ComponentCommonProps, "class">;

export type { CoverArtProps };
export default CoverArt;
