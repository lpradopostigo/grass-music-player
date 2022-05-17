const releases = {
  name: "Releases",
  columns: [
    { name: "id", type: "INTEGER PRIMARY KEY" },
    { name: "title", type: "TEXT" },
    { name: "artist", type: "TEXT" },
    { name: "year", type: "INTEGER" },
    { name: "numberOfTracks", type: "INTEGER" },
    { name: "numberOfDiscs", type: "INTEGER" },
    { name: "thumbnail", type: "TEXT" },
    { name: "picture", type: "TEXT" },
  ],
};

module.exports = releases;
