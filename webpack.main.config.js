// eslint-disable-next-line import/no-extraneous-dependencies
const relocateLoader = require("@vercel/webpack-asset-relocator-loader");

module.exports = {
  entry: "./src/main/main.js",
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: ["mjs", "..."],
  },

  plugins: [
    {
      apply(compiler) {
        compiler.hooks.compilation.tap(
          "webpack-asset-relocator-loader",
          (compilation) => {
            relocateLoader.initAssetCache(compilation, "native_modules");
          }
        );
      },
    },
  ],
};
