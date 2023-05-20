import CoverArt from "./CoverArt.tsx";
import clsx from "clsx";
import { A } from "@solidjs/router";
import { ReleaseOverview } from "../../src-tauri/bindings/ReleaseOverview.ts";

function Release(props: ReleaseProps) {
  const srcs = () => (props.data.thumbnailSrc ? [props.data.thumbnailSrc] : []);

  return (
    <A
      href={`/releases/${props.data.id}`}
      class={clsx(
        "w-cover-art-md scroll-m-3 focus-visible:outline-offset-4",
        props.class
      )}
    >
      <CoverArt srcs={srcs()} />
      <div class="mt-2 line-clamp-2 break-words font-semibold">
        {props.data.name}
      </div>
      <div class="line-clamp-2 text-sm">{props.data.artistCreditName}</div>
    </A>
  );
}

type ReleaseProps = {
  data: ReleaseOverview;
} & Pick<ComponentCommonProps, "class">;

export type { ReleaseProps };

export default Release;
