const log = require("loglevel");

function terminateApp(error) {
  log.error(error);
  process.exit(1);
}

module.exports = { terminateApp };
