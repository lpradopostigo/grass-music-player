import classes from "./index.module.css";
import Library from "../../commands/Library";
import { open } from "@tauri-apps/api/dialog";
import { useSettings } from "../../providers/SettingsProvider";

function Settings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div class={classes.container}>
      <h1>Settings</h1>

      <button
        onClick={async () => {
          await Library.scan(true);
          alert("done");
          // await Library.scanCoverArt();
          // alert("cover done");
        }}
      >
        scan library now
      </button>

      <div>
        <label
          style={{ display: "block", "margin-bottom": "2px" }}
          for="library-path"
        >
          library
        </label>
        <div>
          <input
            id="library-path"
            type="text"
            style={{ "margin-right": "4px" }}
            value={settings()?.libraryPath ?? ""}
            onChange={() => {
              console.log("change");
            }}
          />

          <button
            onClick={async () => {
              const selectedPath = (await open({
                directory: true,
              })) as string | null;

              if (selectedPath) {
                updateSettings({
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
  );
}

export default Settings;
