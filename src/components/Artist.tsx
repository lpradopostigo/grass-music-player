import { A } from "@solidjs/router";
import clsx from "clsx";
import CoverArt from "./CoverArt";
import { ArtistOverview } from "../../src-tauri/bindings/ArtistOverview";

function Artist(props: ArtistProps) {
  return (
    <A
      href={`/artists/${props.data.id}`}
      class={clsx("w-cover-art-md focus-visible:outline-offset-4", props.class)}
    >
      <CoverArt srcs={props.data.thumbnailSrcs} />
      <div class="mt-2 line-clamp-2 break-words font-semibold">
        {props.data.name}
      </div>
    </A>
  );
}

type ArtistProps = {
  data: ArtistOverview;
} & Pick<ComponentCommonProps, "class">;

export type { ArtistProps };
export default Artist;
