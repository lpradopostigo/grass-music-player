import { JSX } from "solid-js";
import { Outlet } from "@solidjs/router";

function Shell(props: ShellProps) {
  return (
    <div class="flex flex-col h-full w-full">
      <header>{props.header}</header>
      <main class="min-h-0 grow">
        <Outlet />
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
