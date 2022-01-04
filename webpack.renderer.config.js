const rules = require("./webpack.rules");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

rules.push({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        modules: {
          localIdentName: "[local]_[hash:base64:5]",
        },
      },
    },
    "postcss-loader",
  ],
});

module.exports = {
  module: {
    rules,
  },
  resolve: {
    extensions: [".jsx", "..."],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
};
