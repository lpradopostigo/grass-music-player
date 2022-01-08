module.exports = (api) => {
  const isTest = api.env("test");

  return {
    presets: isTest
      ? ["@babel/preset-env", "@babel/preset-react"]
      : ["@babel/preset-react"],
  };
};
