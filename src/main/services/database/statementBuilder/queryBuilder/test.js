// noinspection SqlResolve

const {
  buildCreateTable,
  buildDropTable,
  buildInsert,
  buildSelect,
  objectToSqlParams,
} = require("./index");

const userModel = {
  name: "Users",
  columns: [
    { name: "id", type: "INTEGER PRIMARY KEY" },
    { name: "name", type: "TEXT" },
    { name: "email", type: "TEXT" },
  ],
};

describe("queryBuilder", () => {
  describe("build create table queries", () => {
    test("build create Users table query", () => {
      expect(buildCreateTable(userModel, false)).toBe(
        "CREATE TABLE Users(id INTEGER PRIMARY KEY,name TEXT,email TEXT)"
      );
    });

    test("build create Users table query if not exists", () => {
      expect(buildCreateTable(userModel)).toBe(
        "CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY,name TEXT,email TEXT)"
      );
    });

    test("build create Users table query with foreign key", () => {
      expect(
        buildCreateTable({
          ...userModel,
          columns: [
            ...userModel.columns,
            { name: "countryId", type: "INTEGER" },
          ],
          foreignKeys: [
            {
              column: "countryId",
              references: {
                table: "Countries",
                column: "id",
              },
            },
          ],
        })
      ).toBe(
        "CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY,name TEXT,email TEXT,countryId INTEGER, FOREIGN KEY (countryId) REFERENCES Countries(id))"
      );
    });
  });

  describe("build drop table queries", () => {
    test("build drop Users table query", () => {
      expect(buildDropTable(userModel, false)).toBe("DROP TABLE Users");
    });

    test("build drop Users table query if exists", () => {
      expect(buildDropTable(userModel)).toBe("DROP TABLE IF EXISTS Users");
    });
  });

  describe("build insert queries", () => {
    test("build insert query to insert an user", () => {
      expect(
        buildInsert(userModel, { id: 2, name: "Some Guy", email: "some@guy" })
      ).toBe("INSERT INTO Users(id,name,email) VALUES($id,$name,$email)");
    });
  });

  describe("build select queries", () => {
    test("build select all columns from Users table", () => {
      expect(buildSelect(userModel)).toBe("SELECT * FROM Users");
    });

    test("build select id column from Users table", () => {
      expect(buildSelect(userModel, ["id"])).toBe("SELECT id FROM Users");
    });

    test("build select id column from Users table where id is equal to 5", () => {
      const id = 5;
      expect(buildSelect(userModel, ["id"], { id, name: "Bob" })).toBe(
        "SELECT id FROM Users WHERE id = $id AND name = $name"
      );
    });

    test("build select all columns from Users table and order the results by name", () => {
      expect(
        buildSelect(userModel, null, null, { name: "COLLATE NOCASE ASC" })
      ).toBe("SELECT * FROM Users ORDER BY name COLLATE NOCASE ASC");
    });
  });

  describe("objectToSqlParams", () => {
    test("Should append $ to all keys in the object", () => {
      expect(objectToSqlParams({ a: "1", b: 2 })).toStrictEqual({
        $a: "1",
        $b: 2,
      });
    });

    test("Empty object should return empty object", () => {
      expect(objectToSqlParams({})).toStrictEqual({});
    });

    test("null or undefined should return empty object", () => {
      expect(objectToSqlParams(null)).toStrictEqual({});
      expect(objectToSqlParams(undefined)).toStrictEqual({});
    });
  });
});
