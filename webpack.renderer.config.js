const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: "[local]_[hash:base64:5]",
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
    extensions: [".jsx", "..."],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
};
