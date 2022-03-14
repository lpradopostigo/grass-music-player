import { useEffect, useState } from "react";
import { useMantineTheme } from "@mantine/core";
import { getDominantColorFromPicture } from "../utils/color/color";

export default function useReleaseColor(picture) {
  const theme = useMantineTheme();
  const [color, setColor] = useState(theme.white);

  useEffect(() => {
    (async () => {
      setColor(await getDominantColorFromPicture(picture));
    })();
  }, [picture]);

  return color;
}
