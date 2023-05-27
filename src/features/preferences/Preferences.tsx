import LibraryCommands from "../../commands/LibraryCommands.ts";
import { open } from "@tauri-apps/api/dialog";
import { useGlobalData } from "../../contexts/GlobalDataContext.tsx";
import { useQueryClient } from "@tanstack/solid-query";
import { createMemo, createUniqueId, Show } from "solid-js";
import { normalizeProps, useMachine } from "@zag-js/solid";
import * as dialog from "@zag-js/dialog";
import { Portal } from "solid-js/web";
import Loader from "../../components/Loader.tsx";

function Preferences() {
  const { updatePreferences, scanState, preferences } = useGlobalData();
  const queryClient = useQueryClient();

  const [state, send] = useMachine(
    dialog.machine({
      id: createUniqueId(),
      role: "alertdialog",
      closeOnEsc: false,
      closeOnOutsideClick: false,
    })
  );

  const api = createMemo(() => dialog.connect(state, send, normalizeProps));

  async function handleScanClick(type: "normal" | "full") {
    api().open();

    switch (type) {
      case "normal":
        await LibraryCommands.scan();
        break;

      case "full":
        await LibraryCommands.scan(true);
        break;
    }

    queryClient.invalidateQueries(["library"]);
    api().close();
  }

  async function handleSelectPathClick() {
    const selectedPath = (await open({
      directory: true,
    })) as string | null;

    if (selectedPath) {
      await updatePreferences({
        libraryPath: selectedPath,
      });
    }
  }

  return (
    <>
      <Show when={api().isOpen}>
        <Portal>
          <div class="absolute top-0 h-full w-full">
            <div
              {...api().backdropProps}
              class="flex h-full w-full items-center justify-center bg-black bg-opacity-40"
            >
              <div {...api().containerProps} class="w-64 bg-white">
                <div {...api().contentProps} class="flex h-full flex-col">
                  <div
                    {...api().titleProps}
                    class="bg-black p-2 font-semibold text-white"
                  >
                    scan in progress
                  </div>
                  <div class="flex flex-col items-center gap-4 p-4">
                    <div {...api().descriptionProps}>
                      {scanState()?.[0]} of {scanState()?.[1]}
                    </div>
                    <Loader />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      </Show>

      <div class="h-full">
        <div class="p-4">
          <div>
            <label class="block text-sm font-semibold" for="library-path">
              library location
            </label>
            <div class="flex items-center gap-2">
              <input
                id="library-path"
                type="text"
                value={preferences.libraryPath ?? ""}
              />

              <button
                data-size="sm"
                disabled={!preferences.libraryPath}
                onClick={handleSelectPathClick}
              >
                select
              </button>
            </div>
          </div>

          <div class="mt-6 flex gap-2">
            <button
              data-variant="primary"
              disabled={!preferences.libraryPath}
              onClick={() => handleScanClick("normal")}
            >
              scan
            </button>

            <button
              disabled={!preferences.libraryPath}
              onClick={() => handleScanClick("full")}
            >
              full scan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Preferences;
