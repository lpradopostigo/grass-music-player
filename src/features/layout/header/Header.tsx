import MenuBar from "./MenuBar.tsx";
import WindowButtons from "./WindowButtons.tsx";
import Search from "./Search.tsx";

function Header() {
  return (
    <div
      class="flex w-full items-center justify-between shadow"
      data-tauri-drag-region="true"
    >
      <div class="flex items-center gap-3">
        <Search />
        <MenuBar />
      </div>
      <WindowButtons />
    </div>
  );
}

export default Header;
