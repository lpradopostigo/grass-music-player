// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require("electron");
const { join } = require("path");

const USER_DATA_PATH = app.getPath("userData");
const DATABASE_PATH = join(USER_DATA_PATH, "database.db");

module.exports = {
  USER_DATA_PATH,
  DATABASE_PATH,
};
