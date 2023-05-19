import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import LibraryCommands from "../../commands/LibraryCommands";
import Release from "../../components/Release";
import { createQuery } from "@tanstack/solid-query";
import Grid from "../../components/Grid";

function Artist() {
  const params = useParams();
  const artistQuery = createQuery(
    () => ["artists", params.id],
    () => LibraryCommands.getArtist(params.id)
  );

  return (
    <div class="flex h-full flex-col">
      <Show when={artistQuery.data}>
        <div
          class="bg-gray-1 bg-cover bg-center p-4"
          style={{
            "background-image": `linear-gradient(rgba(255, 255, 255, 0.55), rgba(255,255,255, 0.55)), url(${artistQuery.data?.backgroundSrc})`,
          }}
        >
          <h1>{artistQuery.data!.name}</h1>
        </div>

        <Grid
          autofocus
          class="min-h-0 flex-1 overflow-y-auto p-4"
          data={[
            {
              subGridData: artistQuery.data!.releases,
              item: (props) => <Release data={props.dataItem} />,
            },
          ]}
        />
      </Show>
    </div>
  );
}

export default Artist;
