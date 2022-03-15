const ElectronStore = require("electron-store");
const { includes } = require("lodash");

const Keys = {
  LIBRARY_PATH: "libraryPath",
};

const schema = {
  [Keys.LIBRARY_PATH]: {
    type: "string",
    default: "",
  },
};

const store = new ElectronStore({ schema });

/** get the value of a valid key
 * @param {string} key
 * @param {any} [defaultValue]
 * @return {any} */
function getValue(key, defaultValue) {
  if (!includes(Keys, key) || typeof key !== "string") {
    throw Error("invalid key");
  }

  return store.get(key, defaultValue);
}

/** set the value of a valid key
 * @param {string} key
 * @param {any} value a valid json value
 * @return {void} */
function setValue(key, value) {
  if (!includes(Keys, key) || typeof key !== "string") {
    throw Error("invalid key");
  }

  store.set(key, value);
}

module.exports = { getValue, setValue, Keys };
