module.exports = (api) => {
  const isTest = api.env("test");

  if (isTest) {
    return {
      presets: ["@babel/preset-env", "@babel/preset-react"],
    };
  } else {
    return {
      presets: ["@babel/preset-react"],
    };
  }
};
