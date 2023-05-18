import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import LibraryCommands from "../../commands/LibraryCommands";
import Release from "../../components/Release";
import Artist from "../../components/Artist";
import Grid from "../../components/Grid";

function SearchResults() {
  const [params] = useSearchParams();

  const searchQuery = createQuery(
    () => ["search", params.query],
    () => LibraryCommands.search(params.query)
  );

  return (
    <Grid
      class="h-full overflow-y-auto py-4"
      gridClass="p-4"
      data={[
        {
          groupData: searchQuery.data?.releases,
          groupLabel: "releases",
          item: (item) => <Release data={item.dataItem} />,
        },
        {
          groupData: searchQuery.data?.artists,
          groupLabel: "artists",
          item: (item) => <Artist data={item.dataItem} />,
        },
      ]}
    />
  );
}

export default SearchResults;
