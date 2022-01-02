const Database = require("./Database");

class Controller {
  constructor() {
    if (!Controller._instance) {
      Controller._instance = this;
    }
    return Controller._instance;
  }

  static getInstance() {
    return this._instance;
  }

  async doStartup() {
    await Database.construct();
  }
}

module.exports = Controller;
