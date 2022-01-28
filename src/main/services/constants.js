// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require("electron");
const { join } = require("path");

const userDataPath = app.getPath("userData");
const databasePath = join(userDataPath, "database.db");

module.exports = {
  userDataPath,
  databasePath,
};
