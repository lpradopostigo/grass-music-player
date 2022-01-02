const ElectronStore = require("electron-store");
const { includes } = require("ramda");

class PersistentStorage {
  #schema = {
    libraryPath: {
      type: "string",
      default: "",
    },
  };
  #store = new ElectronStore({ schema: this.#schema });
  #keys = ["libraryPath"];

  /** @return {any} */
  get(key, defaultValue = undefined) {
    if (includes(key, this.#keys)) {
      return this.#store.get(key, defaultValue);
    } else {
      throw Error("invalid key");
    }
  }

  /** @param {"libraryPath"} key
   * @param {T[string]} value
   * @return {void} */
  set(key, value) {
    if (includes(key, this.#keys)) {
      this.#store.set(key, value);
    } else {
      throw Error("invalid key");
    }
  }
}


module.exports = PersistentStorage;
