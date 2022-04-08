import { MantineProvider, Global } from "@mantine/core";
import theme, { styles, globalStyles } from "../src/renderer/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <MantineProvider theme={theme} styles={styles} withNormalizeCSS>
      <Global styles={globalStyles} />
      <Story />
    </MantineProvider>
  ),
];
