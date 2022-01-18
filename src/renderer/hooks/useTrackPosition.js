import { useEffect, useState } from "react";
import { grass } from "../services/api";

export default function useTrackPosition() {
  const [position, updatePosition] = useState({ current: 0, total: 0 });

  useEffect(() => {
    setInterval(async () => {
      updatePosition(await grass.getTrackPosition());
    }, 1 / 60);
  }, []);

  return position;
}
