import LibraryCommands from "../../commands/LibraryCommands";
import Release from "../../components/Release";
import { createQuery } from "@tanstack/solid-query";
import useLastScrollPosition from "../../hooks/useLastScrollPosition";
import Grid from "../../components/Grid";

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
      focusedItemPositionKey={"/releases"}
      autofocus
      class="h-full overflow-y-auto p-4"
      data={[
        {
          groupData: releasesQuery.data,
          item: (props) => <Release data={props.dataItem} />,
        },
      ]}
    />
  );
}

export default Releases;
