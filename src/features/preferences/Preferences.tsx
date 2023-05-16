import LibraryCommands from "../../commands/LibraryCommands";
import { open } from "@tauri-apps/api/dialog";
import { useGlobalStore } from "../../providers/GlobalStoreProvider";
import { useQueryClient } from "@tanstack/solid-query";

function Preferences() {
  const [globalData, { updatePreferences }] = useGlobalStore();
  const queryClient = useQueryClient();

  return (
    <div class="h-full">
      <div class="p-4">
        <div>
          <button
            class="mr-2"
            disabled={!globalData.preferences.libraryPath}
            onClick={async () => {
              const startTime = performance.now();

              await LibraryCommands.scan(true);
              queryClient.invalidateQueries(["library"]);
              const endTime = performance.now();

              // await Library.scanCoverArt();
              alert(`done in ${endTime - startTime}ms`);
            }}
          >
            scan library now
          </button>

          <button
            disabled={!globalData.preferences.libraryPath}
            onClick={async () => {
              const startTime = performance.now();
              await LibraryCommands.scanCoverArt();
              queryClient.invalidateQueries(["library"]);
              const endTime = performance.now();

              alert(`done in ${endTime - startTime}ms`);
            }}
          >
            scan cover art now
          </button>
        </div>
        <div class="mt-3">
          <label class="block" for="library-path">
            library
          </label>
          <div>
            <input
              id="library-path"
              type="text"
              class="mr-2 px-1 py-0.5"
              value={globalData.preferences.libraryPath ?? ""}
              onChange={() => {
                console.log("change");
              }}
            />

            <button
              disabled={globalData.preferences.libraryPath === undefined}
              onClick={async () => {
                const selectedPath = (await open({
                  directory: true,
                })) as string | null;

                if (selectedPath) {
                  updatePreferences({
                    libraryPath: selectedPath,
                  });
                }
              }}
            >
              select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preferences;
