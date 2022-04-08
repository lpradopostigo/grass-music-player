const log = require("loglevel");
const fsp = require("fs/promises");
const Database = require("./Database");
const scanner = require("./scanner");
const { DATABASE_PATH } = require("./constants");

async function doStartup() {
  await fsp.unlink(DATABASE_PATH);
  const database = await Database.construct();
  const parsedLibrary = await scanner.getLibrary();
  log.info("parsedLibrary", parsedLibrary);
  await database.open();
  await database.insertReleases(parsedLibrary);
  await database.close();
}

module.exports = { doStartup };
