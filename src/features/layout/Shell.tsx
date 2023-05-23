import { JSX, Suspense } from "solid-js";
import { Outlet } from "@solidjs/router";
import Loader from "../../components/Loader.tsx";

function Shell(props: ShellProps) {
  return (
    <div class="flex h-full w-full flex-col">
      <header>{props.header}</header>
      <main class="min-h-0 grow overflow-hidden">
        <Suspense fallback={<Loader class="h-full" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer>{props.miniPlayer}</footer>
    </div>
  );
}

type ShellProps = {
  header: JSX.Element;
  miniPlayer: JSX.Element;
};

export default Shell;
