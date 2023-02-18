import { createContext, createSignal, useContext } from "solid-js";

const TitleBarThemeContext = createContext();

export default function TitleBarThemeProvider(props) {
  const [backgroundIsDark, setBackgroundIsDark] = createSignal(false);

  return (
    <TitleBarThemeContext.Provider
      value={{
        backgroundIsDark,
        setBackgroundIsDark,
      }}
    >
      {props.children}
    </TitleBarThemeContext.Provider>
  );
}

export function useTitleBarTheme() {
  return useContext(TitleBarThemeContext);
}
