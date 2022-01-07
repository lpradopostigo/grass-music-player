module.exports = {
  stories: ["../src/renderer/**/*.stories.jsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-postcss",
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
          modules: {
            localIdentName: "[local]_[hash:base64:5]",
          },
        },
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: "@storybook/react",
};
