import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
} from "solid-js";
import LibraryService from "../../commands/Library";
import Release from "./Release";
import classes from "./index.module.css";
import { createEventListener } from "@solid-primitives/event-listener";
import { useTitleBarTheme } from "../../components/Shell/TitleBarThemeProvider";

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
  const [containerEl, setContainerEl] = createSignal<HTMLDivElement>();

  const gridSize = createMemo(() => {
    const containerElValue = containerEl();
    const releasesValue = releases();

    if (!containerElValue || !releasesValue) return { columns: 0, rows: 0 };

    const computedStyle = getComputedStyle(containerElValue);
    const columns = computedStyle
      .getPropertyValue("grid-template-columns")
      .replace(" 0px", "")
      .split(" ").length;

    const rows = Math.ceil(releasesValue.length / columns);

    return { columns, rows };
  });

  createEffect(() => {
    const containerElValue = containerEl();
    const releasesValue = releases();
    if (!containerElValue || !releasesValue) return;

    setBackgroundIsDark(false);

    const [firstChild] = containerElValue.children;

    if (firstChild instanceof HTMLElement) {
      firstChild.focus();
    }
  });

  createEventListener(containerEl, "keydown", (event) => {
    const containerElValue = containerEl();

    if (!containerElValue) return;

    const children = Array.from(containerElValue.children);

    const focusedChildIndex = children.findIndex(
      (child) => child === document.activeElement
    );

    const { key } = event;

    if (key === "ArrowRight") {
      const indexToFocus = (focusedChildIndex + 1) % children.length;
      const elementToFocus = children[indexToFocus];

      if (elementToFocus instanceof HTMLElement) {
        elementToFocus.focus();
      }
    } else if (key === "ArrowLeft") {
      const indexToFocus = (focusedChildIndex - 1) % children.length;
      const elementToFocus = children.at(indexToFocus);

      if (elementToFocus instanceof HTMLElement) {
        elementToFocus.focus();
      }
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

      const elementToFocus = children[indexToFocus];

      if (elementToFocus instanceof HTMLElement) {
        elementToFocus.focus();
        elementToFocus.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else if (key === "ArrowUp") {
      event.preventDefault();
      const { columns } = gridSize();

      const isFirstRow = focusedChildIndex < columns;

      const indexToFocus = isFirstRow
        ? children.length - 1
        : focusedChildIndex - columns;

      const elementToFocus = children[indexToFocus];

      if (elementToFocus instanceof HTMLElement) {
        elementToFocus.focus();
        elementToFocus.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  });

  return (
    <div tabIndex={0} ref={setContainerEl} class={classes.container}>
      <For each={releases()}>
        {({ thumbnailSrc, name, artistCreditName, id }) => (
          <Release
            id={id}
            src={thumbnailSrc ?? undefined}
            artistCreditName={artistCreditName}
            name={name}
          />
        )}
      </For>
    </div>
  );
}

export default Library;
