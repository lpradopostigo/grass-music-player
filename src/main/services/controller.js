const log = require("loglevel");
const fsp = require("fs/promises");
const Database = require("./Database");
const scanner = require("./scanner");
const { DATABASE_PATH } = require("./constants");

async function doStartup() {}

module.exports = { doStartup };
