import Icon from "../../../components/Icon";
import { debounce } from "@solid-primitives/scheduled";
import { preventAutoFocus } from "../../../components/Grid";
import { createEffect, onMount } from "solid-js";
import { makeEventListener } from "@solid-primitives/event-listener";
import { useLocation, useNavigate, useSearchParams } from "@solidjs/router";

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  let inputEl: HTMLInputElement | undefined;
  const debouncedNavigate = debounce((query: string) => {
    preventAutoFocus();
    navigate(`/search?query=${query}`);
  }, 250);

  createEffect(() => {
    if (location.pathname === "/search") {
      inputEl!.value = params.query;
      return;
    }

    inputEl!.value = "";
  });

  onMount(() => {
    makeEventListener(document, "keydown", (event) => {
      if (event.target === inputEl) return;

      const regex = /^[a-z0-9]$/i;

      if (regex.test(event.key)) {
        inputEl!.focus();
      }
    });
  });

  function handleSearchInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    debouncedNavigate(value);
  }

  return (
    <div class="relative flex-shrink">
      <div class="absolute grid h-full w-7 place-content-center">
        <Icon width="16" height="16" name="magnifying-glass" />
      </div>
      <input
        ref={inputEl}
        class="w-full py-0.5 pl-7 pr-0.5"
        type="text"
        onInput={handleSearchInput}
      />
    </div>
  );
}

export default SearchBar;
