import { A, Outlet, useLocation } from "@solidjs/router";
import { Show } from "solid-js";
import MenuBar from "../../components/MenuBar";

function Library() {
  const location = useLocation();
  return (
    <div class="flex h-full w-full flex-col">
      <Show
        when={
          location.pathname === "/library/releases" ||
          location.pathname === "/library/artists"
        }
      >
        <MenuBar
          class="w-min bg-gray-0 px-4 py-1"
          data={[
            {
              href: "/library/releases",
              label: "releases",
            },
            {
              href: "/library/artists",
              label: "artists",
            },
          ]}
        />
      </Show>
      <Outlet />
    </div>
  );
}

export default Library;
