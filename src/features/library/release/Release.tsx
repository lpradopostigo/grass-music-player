import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import LibraryCommands from "../../../commands/LibraryCommands.ts";
import TrackList from "./TrackList.tsx";
import { createQuery } from "@tanstack/solid-query";
import clsx from "clsx";

function Release() {
  const params = useParams();

  const releaseQuery = createQuery(
    () => ["releases", params.id],
    () => LibraryCommands.getRelease(params.id)
  );

  return (
    <Show when={releaseQuery.data}>
      <div class="flex h-full flex-col">
        <div
          class={clsx("bg-black bg-cover bg-center p-4 text-white")}
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
