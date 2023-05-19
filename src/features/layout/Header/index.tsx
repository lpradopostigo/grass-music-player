import MenuBar from "./MenuBar";
import WindowButtons from "./WindowButtons";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <div
      class="flex w-full items-center justify-between shadow"
      data-tauri-drag-region="true"
    >
      <MenuBar />
      <SearchBar />
      <WindowButtons />
    </div>
  );
}

export default Header;
