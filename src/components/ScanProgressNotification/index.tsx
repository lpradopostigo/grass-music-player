import { useScanState } from "../../providers/ScanStateProvider";
import { Show } from "solid-js";

const ScanProgressNotification = () => {
  const scanState = useScanState();

  return (
    <Show when={scanState.progress !== null} keyed>
      <div class="notification-container">
        Scanning {scanState.progress![0]} of {scanState.progress![1]}
      </div>
    </Show>
  );
};

export default ScanProgressNotification;
