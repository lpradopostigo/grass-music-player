import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import LibraryCommands from "../../commands/LibraryCommands";
import Grid from "../../components/Grid";
import Release from "../../components/Release";
import { Show } from "solid-js";
import Artist from "../../components/Artist";

function Search() {
  const [params] = useSearchParams();

  const searchQuery = createQuery(
    () => ["search", params.query],
    () => LibraryCommands.search(params.query)
  );

  return (
    <div class="flex h-full flex-col">
      <h1 class="ml-4">Search results</h1>

      <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <Show when={searchQuery.data?.releases.length}>
          <div>
            <h2>Releases</h2>
            <Grid data={searchQuery.data?.releases} columnSize="128px">
              {(item) => <Release data={item.dataItem} />}
            </Grid>
          </div>
        </Show>

        <Show when={searchQuery.data?.artists.length}>
          <div>
            <h2>Artists</h2>
            <Grid data={searchQuery.data?.artists} columnSize="128px">
              {(item) => <Artist data={item.dataItem} />}
            </Grid>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Search;
