import { useLocation, useResolvedPath } from "@solidjs/router";
import { createMemo } from "solid-js";

const trimPathRegex = /^\/+|(\/)\/+$/g;

function normalizePath(path: string, omitSlash = false) {
  const s = path.replace(trimPathRegex, "$1");
  return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}

function useRouteIsActive(href: string) {
  const location = useLocation();
  const to = useResolvedPath(() => href);
  const isActive = createMemo(() => {
    const toValue = to();
    if (toValue === undefined) return false;
    const path = normalizePath(toValue.split(/[?#]/, 1)[0]).toLowerCase();
    return normalizePath(location.pathname).toLowerCase().startsWith(path);
  });

  return isActive;
}

export default useRouteIsActive;
