const sqlite3 = require("sqlite3");
const log = require("loglevel");
const { terminateApp } = require("../../../utils/error");
const {
  buildCreateTable,
  buildDropTable,
  buildInsert,
  buildSelect,
  objectToSqlParams,
} = require("./queryBuilder");

const connection = getConnection();

function getConnection() {
  const { DATABASE_PATH } = require("../../constants");

  return new sqlite3.Database(DATABASE_PATH, (error) => {
    if (error != null) {
      log.error(error);
      terminateApp();
    }
  });
}

function prepareCreateTable(model, ifNotExists = true) {
  return connection.prepare(buildCreateTable(model, ifNotExists));
}

function prepareDropTable(model, ifExists = true) {
  return connection.prepare(buildDropTable(model, ifExists));
}

function prepareInsert(model, values) {
  return connection.prepare(buildInsert(model, values));
}

function prepareSelect(model, columns, where, orderBy) {
  return connection.prepare(buildSelect(model, columns, where, orderBy));
}

module.exports = {
  prepareCreateTable,
  prepareDropTable,
  prepareInsert,
  prepareSelect,
  getConnection,
  objectToSqlParams,
};
