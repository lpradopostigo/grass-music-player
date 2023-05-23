import CoverArt from "./CoverArt.tsx";
import clsx from "clsx";
import { A, useNavigate } from "@solidjs/router";
import { ReleaseOverview } from "../../src-tauri/bindings/ReleaseOverview.ts";

function Release(props: ReleaseProps) {
  const srcs = () => (props.data.thumbnailSrc ? [props.data.thumbnailSrc] : []);

  const navigate = useNavigate();

  const releasePath = () => `/releases/${props.data.id}`;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      navigate(releasePath());
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => navigate(releasePath())}
      class={clsx(
        "h-min w-cover-art-md scroll-m-3 focus-visible:outline-offset-4",
        props.class
      )}
    >
      <CoverArt class="hover:shadow-lg" srcs={srcs()} />
      <A
        tabIndex={-1}
        href={releasePath()}
        class="mt-2 line-clamp-2 break-words font-semibold"
      >
        {props.data.name}
      </A>
      <A
        onClick={(event) => event.stopPropagation()}
        tabIndex={-1}
        href={releasePath()}
        class="line-clamp-2 text-sm"
      >
        {props.data.artistCreditName}
      </A>
    </div>
  );
}

type ReleaseProps = {
  data: ReleaseOverview;
} & Pick<ComponentCommonProps, "class">;

export type { ReleaseProps };

export default Release;
