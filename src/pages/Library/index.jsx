import { createResource, For } from "solid-js";
import LibraryService from "../../services/Library.js";
import Release from "./Release.jsx";
import classes from "./index.module.css";

function Library() {
  const [releases] = createResource(async () => {
    const releases = await LibraryService.findAllReleases();
    return Promise.all(
      releases.map(async (release) => ({
        ...release,
        thumbnailSrc: await LibraryService.findReleaseThumbnail(release.id),
        artistCreditName: (
          await LibraryService.findArtistCredit(release.artistCreditId)
        ).name,
      }))
    );
  });

  return (
    <div class={classes.container}>
      <For each={releases()}>
        {({ thumbnailSrc, name, artistCreditName, id }) => (
          <Release
            id={id}
            src={thumbnailSrc}
            artistCreditName={artistCreditName}
            name={name}
          />
        )}
      </For>
    </div>
  );
}

export default Library;
