import LibraryCommands from "../../commands/LibraryCommands.ts";
import Release from "../../components/Release.tsx";
import { createQuery } from "@tanstack/solid-query";
import useLastScrollPosition from "../../hooks/useLastScrollPosition.ts";
import Grid from "../../components/Grid.tsx";

function Releases() {
  const releasesQuery = createQuery(
    () => ["releases"],
    LibraryCommands.getReleaseOverviews,
    {
      cacheTime: Infinity,
    }
  );

  let gridEl: HTMLDivElement | undefined;

  useLastScrollPosition(
    "/releases",
    () => gridEl,
    () => !!releasesQuery.data
  );

  return (
    <Grid
      ref={gridEl}
      storageKey={"/releases"}
      autofocus
      class="h-full overflow-y-auto p-4"
      data={[
        {
          subGridData: releasesQuery.data,
          item: (props) => <Release data={props.dataItem} />,
        },
      ]}
    />
  );
}

export default Releases;
