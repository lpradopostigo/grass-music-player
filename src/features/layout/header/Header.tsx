import MenuBar from "./MenuBar.tsx";
import WindowButtons from "./WindowButtons.tsx";

function Header() {
  return (
    <div
      class="flex h-10 w-full items-center justify-between shadow"
      data-tauri-drag-region="true"
    >
      <MenuBar />
      <WindowButtons />
    </div>
  );
}

export default Header;
