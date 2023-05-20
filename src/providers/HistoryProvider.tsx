import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  JSX,
  untrack,
  useContext,
} from "solid-js";
import { useLocation } from "@solidjs/router";

const HistoryContext = createContext<HistoryContextValue>();

const MAX_HISTORY_LENGTH = 50;

function HistoryProvider(props: { children: JSX.Element }) {
  const [history, setHistory] = createSignal<string[]>([]);
  const location = useLocation();

  createEffect(() => {
    const path = location.pathname;

    if (untrack(history).length >= MAX_HISTORY_LENGTH) {
      setHistory((prev) => [path, ...prev.slice(1, -1)]);
    } else {
      setHistory((prev) => [path, ...prev]);
    }
  });

  return (
    <HistoryContext.Provider value={{ history }}>
      {props.children}
    </HistoryContext.Provider>
  );
}

function useHistory() {
  return useContext(HistoryContext)!;
}

type HistoryContextValue = {
  history: Accessor<string[]>;
};

export { useHistory };
export default HistoryProvider;
