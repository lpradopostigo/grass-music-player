const log = require("loglevel");
const Database = require("./Database");
const Scanner = require("./Scanner");

class Controller {
  #scanner = new Scanner();

  async doStartup() {
    const database = await Database.construct();
    // const parsedLibrary = await this.#scanner.getLibrary();
    // log.info("parsedLibrary", parsedLibrary);
    // await database.open();
    // await database.insertLibrary(parsedLibrary);
    // await database.close();
  }
}

module.exports = Controller;
