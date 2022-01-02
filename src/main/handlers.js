const { ipcMain } = require("electron");
const Database = require("./services/Database");

ipcMain.handle("library:getReleases", async () => {
  const database = new Database();
  await database.open();
  const releases = await database.getReleases();
  await database.close();
  return releases;
});

ipcMain.handle("library:getTracks", async (event, releaseId) => {
  const database = new Database();
  await database.open();
  const tracks = await database.getTracks(releaseId);
  await database.close();
  return tracks;
});
