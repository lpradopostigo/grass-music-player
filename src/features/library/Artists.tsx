import LibraryCommands from "../../commands/LibraryCommands.ts";
import Artist from "../../components/Artist.tsx";
import { createQuery } from "@tanstack/solid-query";
import useLastScrollPosition from "../../hooks/useLastScrollPosition.ts";
import Grid from "../../components/Grid.tsx";

function Artists() {
  const artistsQuery = createQuery(
    () => ["library", "artists"],
    LibraryCommands.getArtistOverviews,
    {
      cacheTime: Infinity,
    }
  );

  let gridEl: HTMLDivElement | undefined;

  useLastScrollPosition(
    "/artists",
    () => gridEl,
    () => !!artistsQuery.data
  );

  return (
    <Grid
      ref={gridEl}
      storageKey={"/artists"}
      autofocus
      class="h-full overflow-y-auto p-4"
      data={[
        {
          subGridData: artistsQuery.data,
          item: (props) => <Artist data={props.dataItem} />,
        },
      ]}
    />
  );
}

export default Artists;
