import LibraryCommands from "../../commands/LibraryCommands";
import Grid from "../../components/Grid";
import Release from "../../components/Release";
import useLastScrollPosition from "../../hooks/useLastScrollPosition";
import { createQuery } from "@tanstack/solid-query";

function Releases() {
  const releasesQuery = createQuery(
    () => ["library", "releases"],
    LibraryCommands.getLibraryReleases,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  let gridEl!: HTMLDivElement;

  useLastScrollPosition(
    "/library/releases",
    () => gridEl,
    () => !!releasesQuery.data
  );

  return (
    <Grid
      ref={gridEl}
      columnSize="128px"
      class="overflow-y-auto p-4"
      data={releasesQuery.data}
    >
      {(props) => <Release data={props.dataItem} />}
    </Grid>
  );
}

export default Releases;
