const log = require("loglevel");
const Database = require("./Database");
const scanner = require("./scanner");

async function doStartup() {
  const database = await Database.construct();
  // const parsedLibrary = await scanner.getLibrary();
  // log.info("parsedLibrary", parsedLibrary);
  // await database.open();
  // await database.insertReleases(parsedLibrary);
  // await database.close();
}


module.exports = {doStartup};
