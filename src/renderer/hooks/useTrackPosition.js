import {useEffect, useState} from "react";
import {grass} from "../services/api";

export default function useTrackPosition() {
  const [position, updatePosition] = useState({current: 0, total: 0});

  useEffect(() => {
    const handle =
      setInterval(async () => {
        updatePosition(await grass.getTrackPosition());
      }, 100);

    return () => clearInterval(handle)
  }, []);

  return position;
}
