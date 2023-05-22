import { Show } from "solid-js";
import { A } from "@solidjs/router";
import CoverArt from "../../components/CoverArt.tsx";
import { useGlobalData } from "../../contexts/GlobalDataContext.tsx";

function PlaybackInfo() {
  const { playerState } = useGlobalData();

  return (
    <div class="flex items-center gap-2">
      <Show
        when={playerState.track}
        fallback={<CoverArt class="flex-shrink-0" size="sm" />}
      >
        <CoverArt
          class="flex-shrink-0"
          size="sm"
          srcs={
            playerState.track!.thumbnailSrc
              ? [playerState.track!.thumbnailSrc!]
              : []
          }
        />
        <div class="min-w-0">
          <A
            class="block max-w-min truncate font-semibold hover:underline"
            href={`/releases/${playerState.track!.releaseId}`}
          >
            {playerState.track!.name}
          </A>

          <Show
            when={playerState.track!.artists.length > 1}
            fallback={
              <A
                class="block max-w-min truncate text-sm hover:underline"
                href={`/artists/${playerState.track!.artists[0].id}`}
              >
                {playerState.track!.artistCreditName}
              </A>
            }
          >
            <A
              class="block max-w-min truncate text-sm hover:underline"
              href={`/artists/${playerState.track!.artists[0].id}`}
            >
              {playerState.track!.artistCreditName}
            </A>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default PlaybackInfo;
