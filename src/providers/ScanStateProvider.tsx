import {
  createContext,
  onCleanup,
  ParentComponent,
  useContext,
} from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { createStore } from "solid-js/store";
import { ScanState } from "../../src-tauri/bindings/ScanState";

const defaultState: ScanState = {
  progress: null,
};

const ScanStateContext = createContext(defaultState);

const ScanStateProvider: ParentComponent = (props) => {
  const [state, setState] = createStore(defaultState);

  const promise = listen<ScanState>("library:scan-state", ({ payload }) =>
    setState(payload)
  );

  onCleanup(async () => {
    const unlisten = await promise;
    unlisten();
  });

  return (
    <ScanStateContext.Provider value={state}>
      {props.children}
    </ScanStateContext.Provider>
  );
};

export const useScanState = () => useContext(ScanStateContext);

export default ScanStateProvider;
