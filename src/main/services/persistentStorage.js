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

function keyIsValid(key) {
  return includes(key, values(Keys)) && typeof key === "string";
}

/** get the value of a valid key, valid keys are defined in the Keys object */
function getValue(key, defaultValue) {
  if (!keyIsValid(key)) {
    throw Error("invalid key");
  }

  return store.get(key, defaultValue);
}

/** set the value of a valid key, valid keys are defined in the Keys object */
function setValue(key, value) {
  if (!keyIsValid(key)) {
    throw Error("invalid key");
  }

  store.set(key, value);
}

module.exports = { getValue, setValue, Keys };
