const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        modules: true,
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
};
