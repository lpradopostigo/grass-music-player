const { clone } = require("lodash");


/** @param {Function} fn
 * @return {Function} */
function withDeepCopyReturn(fn) {
  return async (...args) => clone(await fn(...args));
}

module.exports = {
  withDeepCopyReturn,
};
