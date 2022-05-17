const tracks = {
  name: "Tracks",
  columns: [
    { name: "id", type: "INTEGER PRIMARY KEY" },
    { name: "title", type: "TEXT" },
    { name: "artist", type: "TEXT" },
    { name: "trackNumber", type: "INTEGER" },
    { name: "discNumber", type: "INTEGER" },
    { name: "duration", type: "INTEGER" },
    { name: "filePath", type: "TEXT" },
    { name: "releaseId", type: "INTEGER NOT NULL" },
  ],
  foreignKeys: [
    {
      column: "releaseId",
      references: { table: "releases", column: "id" },
    },
  ],
};

module.exports = tracks;
