"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.string.starts-with.js");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _web = require("web3");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Web3Utils {
  constructor(commonsContext) {
    _defineProperty(this, "weiToEther", weiAmount => {
      return new _bignumber.default(_web.utils.fromWei(weiAmount.toFixed()));
    });

    _defineProperty(this, "etherToWei", etherAmount => {
      let value = etherAmount;

      if (!(etherAmount instanceof String)) {
        value = etherAmount.toString();
      }

      return new _bignumber.default(_web.utils.toWei(value));
    });

    _defineProperty(this, "addressEquals", (address1, address2) => {
      let checksumAddress1 = this.toChecksumAddress(address1);
      let checksumAddress2 = this.toChecksumAddress(address2);
      return checksumAddress1 !== null && checksumAddress2 !== null && checksumAddress1 === checksumAddress2;
    });

    _defineProperty(this, "abbreviateAddress", address => {
      if (address) {
        let first = address.substring(0, 6);
        let middle = '...';
        let last = address.substring(address.length - 4, address.length);
        return first + middle + last;
      }

      return null;
    });

    _defineProperty(this, "toKeccak256", value => {
      return _web.utils.keccak256(value);
    });

    _defineProperty(this, "isValidAddress", address => {
      return _web.utils.isAddress(address);
    });

    _defineProperty(this, "toChecksumAddress", address => {
      if (address == null && address == undefined) {
        return null;
      }

      const chainId = this.config.network.requiredId;
      const strip_address = this.stripHexPrefix(address).toLowerCase();
      const prefix = chainId != null ? chainId.toString() + '0x' : '';

      const keccak_hash = _web.utils.keccak256(prefix + strip_address).toString('hex');

      let output = '0x';

      for (let i = 0; i < strip_address.length; i++) {
        output += parseInt(keccak_hash[i], 16) >= 8 ? strip_address[i].toUpperCase() : strip_address[i];
      }

      return output;
    });

    _defineProperty(this, "stripHexPrefix", address => {
      if (address != null && address != undefined && address.startsWith('0x')) {
        return address.slice(2);
      }

      return address;
    });

    this.config = commonsContext.config;
  }
  /**
   * Convierte los Wei pasados como parámetro en una cantidad de Ether.
   *
   * @param weiAmount cantidad de wei a converir a en Ether.
   * @returns equivalente en Ether de los Wei pasado como parámetro.
   */


}

var _default = Web3Utils;
exports.default = _default;