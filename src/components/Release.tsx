import CoverArt from "./CoverArt";
import clsx from "clsx";
import { A } from "@solidjs/router";
import { LibraryReleasesItem } from "../../src-tauri/bindings/LibraryReleasesItem";

function Release(props: ReleaseProps) {
  const srcs = () => (props.data.thumbnailSrc ? [props.data.thumbnailSrc] : []);

  return (
    <A
      href={`/library/releases/${props.data.id}`}
      class={clsx("w-cover-art-md", props.class)}
    >
      <CoverArt srcs={srcs()} />
      <div class="font-semibold mt-2 line-clamp-2 break-words">
        {props.data.name}
      </div>
      <div class="text-sm line-clamp-2">{props.data.artistCreditName}</div>
    </A>
  );
}

type ReleaseProps = {
  data: LibraryReleasesItem;
} & Pick<ComponentCommonProps, "class">;

export type { ReleaseProps };

export default Release;
