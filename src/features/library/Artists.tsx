import Grid from "../../components/Grid";
import LibraryCommands from "../../commands/LibraryCommands";
import Artist from "../../components/Artist";
import { createQuery } from "@tanstack/solid-query";
import useLastScrollPosition from "../../hooks/useLastScrollPosition";

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
      saveIndexKey={"/artists"}
      autofocus
      class="h-full overflow-y-auto p-4"
      columnSize="128px"
      data={artistsQuery.data}
    >
      {(props) => <Artist data={props.dataItem} />}
    </Grid>
  );
}

export default Artists;
