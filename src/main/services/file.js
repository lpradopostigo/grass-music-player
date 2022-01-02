const path = require("path");
const fs = require("fs");
const { values, any } = require("ramda");

const AudioExtension = {
  FLAC: "flac",
  MP3: "mp3",
};

/** @param {string} path
 * @return {Promise<boolean>} */
function pathExist(path) {
  return new Promise((resolve) =>
    fs.access(path, fs.constants.F_OK, (err) => {
      resolve(!err);
    })
  );
}

/** @param {string} filePath
 * @return {boolean} */
function isAudioFile(filePath) {
  const audioExtensions = values(AudioExtension);
  const isExtensionOf = (str) => (ext) => str.endsWith(`.${ext}`);
  return any(isExtensionOf(filePath))(audioExtensions);
}

/** @param {string} directoryPath
 * @return { AsyncGenerator<string, void, void>} */
async function* getFiles(directoryPath) {
  const dirents = await fs.promises.readdir(directoryPath, {
    withFileTypes: true,
  });
  for (const dirent of dirents) {
    const res = path.resolve(directoryPath, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

/** @param {string} path
 * @return {Promise<any>} */
function readJson(path) {
  return new Promise((resolve, reject) => {
    fs.promises
      .readFile(path)
      .then((data) => resolve(JSON.parse(data.toString())))
      .catch((error) => reject(error));
  });
}

/** @param {any} obj
 * @param {string} path
 * @return {Promise<void>} */
function writeJson(obj, path) {
  return new Promise((resolve, reject) => {
    fs.promises
      .writeFile(path, Buffer.from(JSON.stringify(obj)))
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}

module.exports = {
  isAudioFile,
  getFiles,
  readJson,
  writeJson,
  pathExist
};
