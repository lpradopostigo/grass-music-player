function buildCreateTable(model, ifNotExists = true) {
  const { name, columns, foreignKeys } = model;

  const ifNotExistsSql = ifNotExists ? "IF NOT EXISTS " : "";
  const columnsSql = columns.map((column) => `${column.name} ${column.type}`);

  const foreignKeysSql = Array.isArray(foreignKeys)
    ? foreignKeys.map(
        ({ column, references }) =>
          `, FOREIGN KEY (${column}) REFERENCES ${references.table}(${references.column})`
      )
    : "";

  return `CREATE TABLE ${ifNotExistsSql}${name}(${columnsSql}${foreignKeysSql})`;
}

function buildDropTable(model, ifExists = true) {
  const { name } = model;
  const ifExistsSql = ifExists ? "IF EXISTS " : "";
  return `DROP TABLE ${ifExistsSql}${name}`;
}

function buildInsert(model, values) {
  const { name } = model;
  const valuesSql = Object.keys(values).map((key) => `${key}`);
  const valuesSqlValues = Object.keys(values).map((key) => `$${key}`);
  return `INSERT INTO ${name}(${valuesSql}) VALUES(${valuesSqlValues})`;
}

function buildSelect(model, columns, where, orderBy) {
  const { name } = model;

  const columnsSql =
    Array.isArray(columns) && columns.length > 0
      ? columns.map((column) => `${column}`)
      : "*";

  const whereSql = where
    ? ` WHERE ${Object.keys(where)
        .map((key) => `${key} = $${key}`)
        .join(" AND ")}`
    : "";

  const orderBySql = orderBy
    ? ` ORDER BY ${Object.keys(orderBy).map((key) => `${key} ${orderBy[key]}`)}`
    : "";

  return `SELECT ${columnsSql} FROM ${name}${whereSql}${orderBySql}`;
}

function objectToSqlParams(object) {
  if (object == null) {
    return {};
  }

  return Object.entries(object).reduce((accum, current) => {
    const [key, value] = current;

    return { ...accum, [`$${key}`]: value };
  }, {});
}

module.exports = {
  buildCreateTable,
  buildDropTable,
  buildInsert,
  buildSelect,
  objectToSqlParams,
};
