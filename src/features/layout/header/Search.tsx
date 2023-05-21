import Icon from "../../../components/Icon.tsx";
import { createMemo, createSignal, createUniqueId, Show } from "solid-js";
import { createEventListener } from "@solid-primitives/event-listener";
import { normalizeProps, useMachine } from "@zag-js/solid";
import * as dialog from "@zag-js/dialog";
import { Portal } from "solid-js/web";
import { createQuery } from "@tanstack/solid-query";
import LibraryCommands from "../../../commands/LibraryCommands.ts";
import Grid from "../../../components/Grid.tsx";
import Release from "../../../components/Release.tsx";
import Artist from "../../../components/Artist.tsx";
import { debounce } from "@solid-primitives/scheduled";

let previousActiveElement: HTMLElement | null = null;

function Search() {
  const [state, send] = useMachine(
    dialog.machine({
      id: createUniqueId(),
      restoreFocus: false,
      onOpen() {
        previousActiveElement = document.activeElement as HTMLElement;
      },
      onClose() {
        if (previousActiveElement) {
          previousActiveElement.focus();
          previousActiveElement = null;
        }
      },
    })
  );

  const api = createMemo(() => dialog.connect(state, send, normalizeProps));

  const [query, setQuery] = createSignal("");

  const searchQuery = createQuery(
    () => ["library", "search", query().trim()],
    () => LibraryCommands.search(query()),
    {
      keepPreviousData: true,
    }
  );

  const debouncedSetQuery = debounce((query: string) => {
    setQuery(query);
  }, 250);

  createEventListener(
    () => document,
    "keydown",
    (event) => {
      if (
        (event.target as HTMLElement | null)?.closest(
          "[role=dialog],[role=alertdialog]"
        )
      )
        return;

      if (event.key === "/") {
        api().open();
      }
    }
  );

  return (
    <>
      <button {...api().triggerProps} class="ml-4" tabIndex={-1}>
        <Icon width="16" height="16" name="magnifying-glass" />
      </button>

      <Show when={api().isOpen}>
        <Portal>
          <div class="absolute top-0 h-full w-full">
            <div
              {...api().backdropProps}
              class="flex h-full w-full items-center justify-center bg-black bg-opacity-40"
            >
              <div
                {...api().containerProps}
                class="h-5/6 w-11/12 max-w-7xl bg-white"
              >
                <div {...api().contentProps} class="flex h-full flex-col">
                  <div class="relative border-b border-gray-3">
                    <div class="absolute  grid h-full w-8 place-content-center">
                      <Icon width="16" height="16" name="magnifying-glass" />
                    </div>
                    <input
                      spellcheck={false}
                      class="w-full border-none py-1.5 pl-8 pr-1.5 focus-visible:outline-none"
                      type="text"
                      placeholder="search for releases, artists, etc"
                      onInput={(event) =>
                        debouncedSetQuery(
                          (event.target as HTMLInputElement).value
                        )
                      }
                    />
                  </div>

                  <Grid
                    class="min-h-0 grow overflow-y-auto pt-4"
                    subGridClass="p-4"
                    data={[
                      {
                        subGridData: searchQuery.data?.releases,
                        subGridLabel: "releases",
                        item: (item) => <Release data={item.dataItem} />,
                      },
                      {
                        subGridData: searchQuery.data?.artists,
                        subGridLabel: "artists",
                        item: (item) => <Artist data={item.dataItem} />,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}

export default Search;
