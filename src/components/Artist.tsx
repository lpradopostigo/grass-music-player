import { A } from "@solidjs/router";
import clsx from "clsx";
import CoverArt from "./CoverArt";
import { LibraryArtistsItem } from "../../src-tauri/bindings/LibraryArtistsItem";

function Artist(props: ArtistProps) {
  return (
    <A
      href={`/library/artists/${props.data.id}`}
      class={clsx("w-cover-art-md", props.class)}
    >
      <CoverArt srcs={props.data.thumbnailSrcs} />
      <div class="font-semibold mt-2 line-clamp-2 break-words">
        {props.data.name}
      </div>
    </A>
  );
}

type ArtistProps = {
  data: LibraryArtistsItem;
} & Pick<ComponentCommonProps, "class">;

export type { ArtistProps };
export default Artist;
