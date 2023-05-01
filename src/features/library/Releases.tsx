import LibraryCommands from "../../commands/LibraryCommands";
import Grid from "../../components/Grid";
import Release from "../../components/Release";
import { createQuery } from "@tanstack/solid-query";
import useLastScrollPosition from "../../hooks/useLastScrollPosition";

function Releases() {
  const releasesQuery = createQuery(
    () => ["library", "releases"],
    LibraryCommands.getLibraryReleases,
    {
      cacheTime: Infinity,
    }
  );

  let gridEl: HTMLDivElement | undefined;

  useLastScrollPosition(
    "/library/releases",
    () => gridEl,
    () => !!releasesQuery.data
  );

  return (
    <Grid
      ref={gridEl}
      saveIndexKey={"/library/releases"}
      autofocus
      columnSize="128px"
      class="overflow-y-auto p-4"
      data={releasesQuery.data}
    >
      {(props) => <Release data={props.dataItem} />}
    </Grid>
  );
}

export default Releases;
