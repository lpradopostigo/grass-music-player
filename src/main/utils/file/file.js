const fs = require("fs");
const fsp = require("fs/promises");

const { values, any } = require("ramda");
const path = require("path");
const log = require("loglevel");

const AudioExtension = {
  FLAC: "flac",
  MP3: "mp3",
};

function pathExist(filePath) {
  return new Promise((resolve) =>
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    })
  );
}

function isAudioPath(filePath) {
  const audioExtensions = values(AudioExtension);
  const isExtensionOf = (str) => (ext) => str.endsWith(`.${ext}`);
  return any(isExtensionOf(filePath))(audioExtensions);
}

async function* getFiles(filePath) {
  const dirents = await fsp
    .readdir(filePath, {
      withFileTypes: true,
    })
    .catch((error) => log.error(error));
  for (const dirent of dirents) {
    const res = path.join(filePath, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

function readJson(path) {
  return new Promise((resolve, reject) => {
    fs.promises
      .readFile(path)
      .then((data) => resolve(JSON.parse(data.toString())))
      .catch((error) => reject(error));
  });
}

function writeJson(obj, path) {
  return new Promise((resolve, reject) => {
    fs.promises
      .writeFile(path, Buffer.from(JSON.stringify(obj)))
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}

module.exports = {
  isAudioPath,
  getFiles,
  readJson,
  writeJson,
  pathExist,
};
