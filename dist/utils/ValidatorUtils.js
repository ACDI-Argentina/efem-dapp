"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.regexp.test.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.to-string.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ValidatorUtils {
  constructor() {
    _defineProperty(this, "isValidEmail", email => {
      if (!email) {
        return false;
      }

      if (email.match(this.EMAIL_PATTERN)) {
        return true;
      }

      return false;
    });

    _defineProperty(this, "isValidUrl", url => {
      if (!url) {
        return false;
      }

      if (this.URL_PATTERN.test(url)) {
        return true;
      }

      return false;
    });

    this.EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.URL_PATTERN = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  }
  /**
   * Valida que el email sea válido.
   * 
   * @param email a validar
   */


}

var _default = ValidatorUtils;
exports.default = _default;