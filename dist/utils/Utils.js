"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanIpfsPath = void 0;

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.to-string.js");

/**
 * If path is an ipfsUrl, return just the ipfs path, otherwise returns the path param
 *
 * @param {string} path the path to clean
 */
const cleanIpfsPath = path => {
  const re = new RegExp(/\/ipfs\/\w+$/);
  const match = re.exec(path);

  if (match) {
    return match[0];
  }

  return path;
};

exports.cleanIpfsPath = cleanIpfsPath;