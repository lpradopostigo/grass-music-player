const log = require("loglevel");
const fsp = require("fs/promises");
const database = require("./database");
const scanner = require("./scanner");
const { DATABASE_PATH } = require("./constants");

async function doStartup() {}

module.exports = { doStartup };
