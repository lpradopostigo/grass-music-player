import Grid from "../../components/Grid";
import LibraryCommands from "../../commands/LibraryCommands";
import Artist from "../../components/Artist";
import useLastScrollPosition from "../../hooks/useLastScrollPosition";
import { createQuery } from "@tanstack/solid-query";

function Artists() {
  const artistsQuery = createQuery(
    () => ["library", "artists"],
    LibraryCommands.getLibraryArtists,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  let gridEl!: HTMLDivElement;

  useLastScrollPosition(
    "/library/artists",
    () => gridEl,
    () => !!artistsQuery.data
  );

  return (
    <Grid
      ref={gridEl}
      class="overflow-y-auto p-4"
      columnSize="128px"
      data={artistsQuery.data}
    >
      {(props) => <Artist data={props.dataItem} />}
    </Grid>
  );
}

export default Artists;
