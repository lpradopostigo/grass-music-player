import { useEffect, useState } from "react";
import { grass } from "../services/api";
import usePlayerControls from "./usePlayerControls";

export default function usePlayerPlaylist() {
  const [playlist, setPlaylist] = useState([]);
  const controls = usePlayerControls();

  useEffect(() => {
    (async () => {
      const handle = setInterval(async () => {
        setPlaylist(await grass.getPlaylist());
      }, 100);

      return () => clearInterval(handle);
    })();
  }, []);

  return [playlist, controls.setPlaylist];
}
