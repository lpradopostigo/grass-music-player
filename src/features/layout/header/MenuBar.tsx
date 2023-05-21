import { Index } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { createEventListener } from "@solid-primitives/event-listener";

const data = [
  { href: "/releases", label: "releases" },
  { href: "/artists", label: "artists" },
  { href: "/playlists", label: "playlists" },
  { href: "/preferences", label: "preferences" },
];

function MenuBar() {
  const navigate = useNavigate();

  createEventListener(
    () => document,
    "keydown",
    (event) => {
      if (
        (event.target as HTMLElement | null)?.closest(
          "[role=dialog],[role=alertdialog]"
        )
      )
        return;

      const index = Number(event.key);
      const item = data[index - 1];

      if (!isNaN(index) && item) {
        navigate(item.href);
      }
    }
  );

  return (
    <div class="flex gap-2 py-2.5 uppercase">
      <Index each={data}>
        {(item) => (
          <A tabIndex={-1} activeClass="font-bold" href={item().href}>
            {item().label}
          </A>
        )}
      </Index>
    </div>
  );
}

export default MenuBar;
