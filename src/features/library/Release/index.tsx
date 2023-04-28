import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import LibraryCommands from "../../../commands/LibraryCommands";
import TrackList from "./TrackList";
import { createQuery } from "@tanstack/solid-query";

function Release() {
  const params = useParams();

  const releaseQuery = createQuery(
    () => ["library", "releases", params.id],
    () => LibraryCommands.getLibraryRelease(params.id)
  );

  return (
    <Show when={releaseQuery.isSuccess}>
      <div class="flex h-full flex-col">
        <div
          class="bg-cover bg-center p-4 text-white"
          style={{
            "background-image": `linear-gradient(rgba(0, 0, 0, 0.425), rgba(0,0,0, 0.425)), url(${
              releaseQuery.data!.coverArtSrc
            })`,
          }}
        >
          <h1>{releaseQuery.data!.name}</h1>
          <div class="font-semibold">{releaseQuery.data!.artistCreditName}</div>
          <div class="text-sm">{releaseQuery.data!.date}</div>
        </div>

        <TrackList class="min-h-0 flex-1" data={releaseQuery.data!.tracks} />
      </div>
    </Show>
  );
}

export default Release;
