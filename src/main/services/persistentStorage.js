const ElectronStore = require("electron-store");
const { includes, values } = require("ramda");

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
  if (includes(key, values(Keys))) {
    return store.get(key, defaultValue);
  }
  throw Error("invalid key");
}

/** set the value of a valid key
 * @param {string} key
 * @param {any} value a valid json value
 * @return {void} */
function setValue(key, value) {
  if (includes(key, values(Keys))) {
    store.set(key, value);
    return;
  }
  throw Error("invalid key");
}

module.exports = { getValue, setValue, Keys };
