import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import Library from "../../commands/Library.js";
import classes from "./index.module.css";
import TrackList from "./TrackList.jsx";
import { useTitleBarTheme } from "../../components/Shell/TitleBarThemeProvider.jsx";

function Release() {
  const params = useParams();
  const { setBackgroundIsDark } = useTitleBarTheme();

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

  setBackgroundIsDark(true);

  const gradient = "linear-gradient(rgba(0, 0, 0, 0.425), rgba(0,0,0, 0.425))";

  return (
    <Show when={release() && tracks()} keyed>
      <div class={classes.container}>
        <header
          class={classes.header}
          style={{
            "background-image": `${gradient}, url(${release().pictureSrc})`,
          }}
        >
          <h1>{release().name}</h1>
          <div class={classes.artistCredit}>{release().artistCreditName}</div>
          <div class={classes.date}>{release().date}</div>
        </header>

        <TrackList tracks={tracks()} />
      </div>
    </Show>
  );
}

export default Release;
