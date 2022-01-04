const fs = require("fs");
const { values, any } = require("ramda");
const { resolve } = require("path");

const AudioExtension = {
  FLAC: "flac",
  MP3: "mp3",
};

function pathExist(path) {
  return new Promise((resolve) =>
    fs.access(path, fs.constants.F_OK, (err) => {
      resolve(!err);
    })
  );
}

function isAudioPath(path) {
  const audioExtensions = values(AudioExtension);
  const isExtensionOf = (str) => (ext) => str.endsWith(`.${ext}`);
  return any(isExtensionOf(path))(audioExtensions);
}

async function* getFiles(path) {
  const dirents = await fs.promises.readdir(path, {
    withFileTypes: true,
  });
  for (const dirent of dirents) {
    const res = resolve(path, dirent.name);
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
