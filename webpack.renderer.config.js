const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rules = require("./webpack.rules.js");

rules.push({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: "[local]_[hash:base64:5]",
          exportLocalsConvention: "camelCase",
        },
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  resolve: {
    extensions: [".jsx", "svelte", "..."],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
};
