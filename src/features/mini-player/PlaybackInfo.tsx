import { Show } from "solid-js";
import { A } from "@solidjs/router";
import CoverArt from "../../components/CoverArt.tsx";
import { useGlobalStore } from "../../providers/GlobalStoreProvider.tsx";

function PlaybackInfo() {
  const [globalData] = useGlobalStore();

  return (
    <div class="flex items-center gap-2">
      <Show
        when={globalData.playerState.track}
        fallback={<CoverArt class="flex-shrink-0" size="sm" />}
      >
        <CoverArt
          class="flex-shrink-0"
          size="sm"
          srcs={
            globalData.playerState.track!.thumbnailSrc
              ? [globalData.playerState.track!.thumbnailSrc!]
              : []
          }
        />
        <div class="min-w-0">
          <A
            class="block max-w-min truncate font-semibold hover:underline"
            href={`/releases/${globalData.playerState.track!.releaseId}`}
          >
            {globalData.playerState.track!.name}
          </A>

          <Show
            when={globalData.playerState.track!.artists.length > 1}
            fallback={
              <A
                class="block max-w-min truncate text-sm hover:underline"
                href={`/artists/${globalData.playerState.track!.artists[0].id}`}
              >
                {globalData.playerState.track!.artistCreditName}
              </A>
            }
          >
            <A
              class="block max-w-min truncate text-sm hover:underline"
              href={`/artists/${globalData.playerState.track!.artists[0].id}`}
            >
              {globalData.playerState.track!.artistCreditName}
            </A>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default PlaybackInfo;
