import { A, useNavigate } from "@solidjs/router";
import clsx from "clsx";
import CoverArt from "./CoverArt.tsx";
import { ArtistOverview } from "../../src-tauri/bindings/ArtistOverview.ts";

function Artist(props: ArtistProps) {
  const navigate = useNavigate();

  const artistPath = () => `/artists/${props.data.id}`;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      navigate(artistPath());
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => navigate(artistPath())}
      class={clsx(
        "h-min w-cover-art-md scroll-m-3 focus-visible:outline-offset-4",
        props.class
      )}
    >
      <CoverArt class="hover:shadow-lg" srcs={props.data.thumbnailSrcs} />
      <A
        tabIndex={-1}
        href={artistPath()}
        class="mt-2 line-clamp-2 break-words font-semibold"
      >
        {props.data.name}
      </A>
    </div>
  );
}

type ArtistProps = {
  data: ArtistOverview;
} & Pick<ComponentCommonProps, "class">;

export type { ArtistProps };
export default Artist;
