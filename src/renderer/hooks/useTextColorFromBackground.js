import { useEffect, useState } from "react";
import theme from "../theme/theme";
import { getTextColorFromBackground } from "../utils/color";

export default function useTextColorFromBackground(backgroundColor) {
  const [color, setColor] = useState(theme.black);
  useEffect(() => {
    setColor(getTextColorFromBackground(backgroundColor));
  }, [backgroundColor]);

  return color;
}
