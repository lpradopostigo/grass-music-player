import { useEffect, useState } from "react";
import { grass } from "../services/api";

export default function useTrackPosition() {
  const [position, setPosition] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const handle = setInterval(async () => {
      setPosition(await grass.getTrackPosition());
    }, 100);

    return () => clearInterval(handle);
  }, []);

  return [position, (newPosition) => grass.setTrackPosition(newPosition)];
}
