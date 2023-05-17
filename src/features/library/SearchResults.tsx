import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import LibraryCommands from "../../commands/LibraryCommands";
import Grid from "../../components/Grid";
import Release from "../../components/Release";
import { Show } from "solid-js";
import Artist from "../../components/Artist";

function SearchResults() {
  const [params] = useSearchParams();

  const searchQuery = createQuery(
    () => ["search", params.query],
    () => LibraryCommands.search(params.query)
  );

  return (
    <div class="flex h-full flex-col gap-8 overflow-y-auto">
      <Show when={searchQuery.data?.releases.length}>
        <div>
          <div class="mt-4 w-min bg-black pl-4 pr-2  text-xl font-bold  text-white">
            releases
          </div>
          <Grid
            class="p-4"
            data={searchQuery.data?.releases}
            columnSize="128px"
          >
            {(item) => <Release data={item.dataItem} />}
          </Grid>
        </div>
      </Show>

      <Show when={searchQuery.data?.artists.length}>
        <div>
          <div class="mt-4 w-min bg-black pl-4 pr-2 text-xl font-bold  text-white">
            artists
          </div>

          <Grid class="p-4" data={searchQuery.data?.artists} columnSize="128px">
            {(item) => <Artist data={item.dataItem} />}
          </Grid>
        </div>
      </Show>
    </div>
  );
}

export default SearchResults;
