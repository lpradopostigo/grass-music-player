import { useParams } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";
import Library from "../../services/Library.js";
import classes from "./index.module.css";
import Track from "./Track.jsx";
import Player from "../../services/Player/index.js";
import { usePlayerState } from "../../services/Player/context.jsx";

function Release() {
  const params = useParams();
  const playerState = usePlayerState();
  const [release] = createResource(params.id, async (id) => {
    const release = await Library.findRelease(id);
    const pictureSrc = await Library.findReleasePicture(id);
    const artistCredit = await Library.findArtistCredit(release.artistCreditId);

    return {
      ...release,
      pictureSrc,
      artistCreditName: artistCredit.name,
    };
  });

  const [tracks] = createResource(params.id, async (id) => {
    const tracks = await Library.findTracksByReleaseId(id);
    const tracksWithCreditName = tracks.map(async (track) => ({
      ...track,
      artistCreditName: (await Library.findArtistCredit(track.artistCreditId))
        .name,
    }));

    return Promise.all(tracksWithCreditName);
  });

  return (
    <Show when={release() && tracks()} keyed>
      <div class={classes.container}>
        <header>
          <Show when={release().pictureSrc} keyed={false}>
            <img src={release().pictureSrc} alt="picture" />
          </Show>
          <h1>{release().name}</h1>
          <div class={classes.artistCredit}>{release().artistCreditName}</div>
          <div class={classes.date}>{release().date}</div>
        </header>

        <ul class={classes.tracks}>
          <For each={tracks()}>
            {(track, index) => (
              <Track
                {...track}
                active={
                  playerState.currentTrackPath === track.path &&
                  playerState.playbackState === "playing"
                }
                onClick={async () => {
                  await Player.setPlaylist(tracks().map(({ path }) => path));
                  await Player.skipToTrack(index());
                  await Player.play();
                }}
              />
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
}

export default Release;
