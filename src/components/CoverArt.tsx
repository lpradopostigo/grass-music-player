import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  mergeProps,
  Switch,
} from "solid-js";
import clsx from "clsx";
import Icon from "./Icon.tsx";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

function CoverArt(props: CoverArtProps) {
  const localProps = mergeProps(
    {
      size: "md" as CoverArtSize,
      srcs: [] as string[],
    },
    props
  );

  let containerEl: HTMLDivElement | undefined;

  const isVisible = createVisibilityObserver()(() => containerEl);
  const srcs = () => localProps.srcs.slice(0, maxSrcs);
  const [images, setImages] = createSignal<ImageResult[]>([]);

  const imageElements = createMemo(() =>
    images().map((image) => image.element)
  );

  const imagesFullyLoaded = createMemo(
    () => images().length > 0 && images().every((image) => image.loaded)
  );

  function fetchImages(srcs: string[]) {
    const promises = srcs.map((src) => {
      return new Promise<ImageResult>((resolve) => {
        const image = new Image();

        image.onload = () => {
          image.className = "h-full w-full object-cover overflow-hidden";
          resolve({
            element: image,
            loaded: image.complete && image.naturalHeight !== 0,
          });
        };
        image.src = src;
      });
    });

    return Promise.all(promises);
  }

  createEffect(() => {
    if (isVisible()) {
      fetchImages(srcs()).then((images) => {
        setImages(images);
      });
    } else {
      setImages([]);
    }
  });

  const columns = () => Math.max(srcs().length, 1);

  return (
    <div
      ref={containerEl}
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
      <Switch>
        <Match when={!isVisible()}>
          <div class="h-full w-full bg-black" />
        </Match>
        <Match when={isVisible() && imagesFullyLoaded()}>
          {imageElements()}
        </Match>

        <Match when={isVisible() && !imagesFullyLoaded()}>
          <div
            class={clsx(
              "grid h-full w-full place-content-center bg-black text-white",
              {
                "text-[24px]": localProps.size === "sm",
                "text-[40px]": localProps.size === "md",
                "text-[64px]": localProps.size === "lg",
              }
            )}
          >
            <Icon name="music-notes" />
          </div>
        </Match>
      </Switch>
    </div>
  );
}

const maxSrcs = 3;

type ImageResult = {
  element: HTMLImageElement;
  loaded: boolean;
};

type CoverArtSize = "sm" | "md" | "lg";

type CoverArtProps = {
  srcs?: string[];
  size?: CoverArtSize;
} & Pick<ComponentCommonProps, "class">;

export type { CoverArtProps };
export default CoverArt;
