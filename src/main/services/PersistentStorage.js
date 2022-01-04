const ElectronStore = require("electron-store");
const { includes, values } = require("ramda");

class PersistentStorage {
  static Keys = {
    LIBRARY_PATH: "libraryPath",
  };

  static #schema = {
    [PersistentStorage.Keys.LIBRARY_PATH]: {
      type: "string",
      default: "",
    },
  };

  #store = new ElectronStore({ schema: PersistentStorage.#schema });

  get(key, defaultValue = undefined) {
    if (includes(key, values(PersistentStorage.Keys))) {
      return this.#store.get(key, defaultValue);
    }
    throw Error("invalid key");
  }

  set(key, value) {
    if (includes(key, values(PersistentStorage.Keys))) {
      this.#store.set(key, value);
    }
    throw Error("invalid key");
  }
}

module.exports = PersistentStorage;
