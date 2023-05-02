import CoverArt from "./CoverArt";
import clsx from "clsx";
import { A } from "@solidjs/router";
import { LibraryReleasesItem } from "../../src-tauri/bindings/LibraryReleasesItem";

function Release(props: ReleaseProps) {
  const srcs = () => (props.data.thumbnailSrc ? [props.data.thumbnailSrc] : []);

  let containerEl: HTMLAnchorElement | undefined;

  return (
    <A
      ref={containerEl}
      href={`/library/releases/${props.data.id}`}
      class={clsx("w-cover-art-md focus-visible:outline-offset-4", props.class)}
    >
      <CoverArt parentElement={containerEl} srcs={srcs()} />
      <div class="mt-2 line-clamp-2 break-words font-semibold">
        {props.data.name}
      </div>
      <div class="line-clamp-2 text-sm">{props.data.artistCreditName}</div>
    </A>
  );
}

type ReleaseProps = {
  data: LibraryReleasesItem;
} & Pick<ComponentCommonProps, "class">;

export type { ReleaseProps };

export default Release;
