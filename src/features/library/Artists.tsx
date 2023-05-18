import LibraryCommands from "../../commands/LibraryCommands";
import Artist from "../../components/Artist";
import { createQuery } from "@tanstack/solid-query";
import useLastScrollPosition from "../../hooks/useLastScrollPosition";
import Grid from "../../components/Grid";

function Artists() {
  const artistsQuery = createQuery(
    () => ["artists"],
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
      focusedItemPositionKey={"/artists"}
      autofocus
      class="h-full overflow-y-auto p-4"
      data={[
        {
          groupData: artistsQuery.data,
          item: (props) => <Artist data={props.dataItem} />,
        },
      ]}
    />
  );
}

export default Artists;
