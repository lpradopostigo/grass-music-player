import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import LibraryCommands from "../../commands/LibraryCommands";
import Grid from "../../components/Grid";
import Release from "../../components/Release";
import { createQuery } from "@tanstack/solid-query";

function Artist() {
  const params = useParams();
  const artistQuery = createQuery(
    () => ["library", "artists", params.id],
    () => LibraryCommands.getLibraryArtist(params.id)
  );

  return (
    <div class="flex h-full flex-col">
      <Show when={artistQuery.isSuccess}>
        <h1 class="px-4">{artistQuery.data!.name}</h1>

        <Grid
          class="min-h-0 flex-1 overflow-y-auto p-4"
          data={artistQuery.data!.releases}
          columnSize="128px"
        >
          {(props) => <Release data={props.dataItem} />}
        </Grid>
      </Show>
    </div>
  );
}

export default Artist;
