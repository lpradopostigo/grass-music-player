import { Accessor, createEffect, onMount } from "solid-js";
import { useBeforeLeave } from "@solidjs/router";

const storage: Record<string, number> = {};

function useLastScrollPosition(
  key: string,
  element: Accessor<HTMLElement>,
  condition: Accessor<boolean>
) {
  let executed = false;

  createEffect(() => {
    const elementValue = element();
    const lastPosition = storage[key];
    const conditionValue = condition();
    if (executed || !lastPosition || !elementValue || !conditionValue) return;

    elementValue.scrollTo(0, lastPosition);
    executed = true;
  });

  useBeforeLeave(() => {
    const elementValue = element();
    if (!elementValue) return;
    storage[key] = elementValue.scrollTop;
  });
}

export default useLastScrollPosition;
