import classes from "./index.module.css";
import { createEventListener } from "@solid-primitives/event-listener";
import { createEffect, createSignal } from "solid-js";
import { Release } from "../../../../src-tauri/bindings/Release";
import { createScheduled, debounce } from "@solid-primitives/scheduled";

function Search<T extends Release & { artistCreditName: string }>(
  props: SearchProps<T>
) {
  const [showInput, setShowInput] = createSignal(false);

  const [inputEl, setInputEl] = createSignal<HTMLInputElement>();

  const [inputValue, setInputValue] = createSignal("");

  const scheduled = createScheduled((fn) => debounce(fn, 250));

  let containerEl: HTMLDivElement | undefined;

  createEffect(() => {
    const value = inputValue();
    if (scheduled()) {
      const filteredData = props.data?.filter((x) => {
        const filterString = `${x.name} ${x.artistCreditName}`.toLowerCase();

        return filterString.includes(value.toLowerCase());
      });

      props.onSearch?.(filteredData ?? []);
    }
  });

  createEventListener(inputEl, "keydown", (event) => {
    if (event.key === "Escape") {
      setShowInput(false);

      props.onCancel?.();
    }
  });

  createEventListener(
    () => containerEl?.parentElement ?? undefined,
    "keydown",
    (event) => {
      const regex = /^[a-z0-9]$/i;

      if (regex.test(event.key)) {
        setShowInput(true);
        inputEl()?.focus();
      }
    }
  );

  return (
    <div class={props.class} ref={containerEl}>
      {showInput() && (
        <input
          onInput={(event) => setInputValue(event.currentTarget.value)}
          ref={setInputEl}
          type="text"
        />
      )}
    </div>
  );
}

type SearchProps<T> = {
  data?: T[];
  onSearch?: (filteredData: T[]) => void;
  onCancel?: () => void;
  class?: string;
};

export default Search;
