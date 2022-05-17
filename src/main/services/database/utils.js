const log = require("loglevel");
const {
  prepareDropTable,
  prepareCreateTable,
  prepareInsert,
  prepareSelect,
  objectToSqlParams,
} = require("./statementBuilder");

function createTable(model) {
  if (model == null || typeof model !== "object") {
    log.warn("createTable: model is not an object");
    return null;
  }

  const sql = prepareCreateTable(model);

  return new Promise((resolve, reject) => {
    sql.run([], (error) => {
      if (error != null) reject(error);
      resolve();
    });
  });
}

function dropTable(model) {
  if (model == null || typeof model !== "object") {
    log.warn("dropTable: model is not an object");
    return null;
  }

  const sql = prepareDropTable(model);

  return new Promise((resolve, reject) => {
    sql.run([], (error) => {
      if (error != null) reject(error);
      resolve();
    });
  });
}

function select(model, columns, where, orderBy) {
  if (model == null || typeof model !== "object") {
    log.warn("select: model is not an object");
    return null;
  }

  const sql = prepareSelect(model, columns, where, orderBy);

  return new Promise((resolve, reject) => {
    sql.all(objectToSqlParams(where), (error, rows) => {
      if (error != null) reject(error);
      resolve(rows);
    });
  });
}

function insert(model, data) {
  if (model == null || typeof model !== "object") {
    log.warn("insert: model is not an object");
    return null;
  }

  if (!Array.isArray(data)) {
    log.warn("insert: data is not an array");
    return null;
  }

  if (data.length === 0) {
    log.warn("insert: data is empty");
    return null;
  }

  return Promise.all(
    data.map((values) => {
      const sql = prepareInsert(model, values);
      return new Promise((resolve, reject) => {
        sql.run(objectToSqlParams(values), (error) => {
          if (error != null) reject(error);
          resolve();
        });
      });
    })
  );
}

module.exports = {
  createTable,
  dropTable,
  select,
  insert,
};
