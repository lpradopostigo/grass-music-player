import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  Setter,
  useContext,
} from "solid-js";

type ContextProps = {
  backgroundIsDark: Accessor<boolean>;
  setBackgroundIsDark: Setter<boolean>;
};

const TitleBarThemeContext = createContext<ContextProps>();

export default function TitleBarThemeProvider(props: {
  children: JSX.Element;
}) {
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
  return useContext(TitleBarThemeContext)!;
}
