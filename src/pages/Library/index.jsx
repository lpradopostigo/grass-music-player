import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  onMount,
} from "solid-js";
import LibraryService from "../../commands/Library.js";
import Release from "./Release.jsx";
import classes from "./index.module.css";
import {
  createEventListener,
  makeEventListener,
} from "@solid-primitives/event-listener";
import { useTitleBarTheme } from "../../components/Shell/TitleBarThemeProvider.jsx";

function Library() {
  const { setBackgroundIsDark } = useTitleBarTheme();

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
  const [containerEl, setContainerEl] = createSignal();

  const gridSize = createMemo(() => {
    if (!containerEl() || !releases()) return null;

    const computedStyle = getComputedStyle(containerEl());
    const columns = computedStyle
      .getPropertyValue("grid-template-columns")
      .replace(" 0px", "")
      .split(" ").length;

    const rows = Math.ceil(releases().length / columns);

    return { columns, rows };
  });

  createEffect(() => {
    if (!containerEl() || !releases()) return;

    setBackgroundIsDark(false);
    containerEl().children[0].focus();
  });

  createEventListener(containerEl, "keydown", (event) => {
    const children = Array.from(containerEl().children);

    const focusedChildIndex = children.findIndex(
      (child) => child === document.activeElement
    );

    const { key } = event;

    if (key === "ArrowRight") {
      const indexToFocus = (focusedChildIndex + 1) % children.length;
      children[indexToFocus].focus();
    } else if (key === "ArrowLeft") {
      const indexToFocus = (focusedChildIndex - 1) % children.length;
      children.at(indexToFocus).focus();
    } else if (key === "ArrowDown") {
      event.preventDefault();
      const { columns, rows } = gridSize();

      let indexToFocus;

      const isLastRow = focusedChildIndex >= (rows - 1) * columns;
      const noChildBelow = focusedChildIndex + columns >= children.length;

      if (isLastRow) {
        indexToFocus = 0;
      } else if (noChildBelow) {
        indexToFocus = children.length - 1;
      } else {
        indexToFocus = focusedChildIndex + columns;
      }

      children[indexToFocus].focus();
      children[indexToFocus].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (key === "ArrowUp") {
      event.preventDefault();
      const { columns } = gridSize();

      const isFirstRow = focusedChildIndex < columns;

      const indexToFocus = isFirstRow
        ? children.length - 1
        : focusedChildIndex - columns;

      children[indexToFocus].focus();
      children[indexToFocus].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  return (
    <div
      tabIndex={0}
      ref={(el) => setContainerEl(el)}
      class={classes.container}
    >
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
