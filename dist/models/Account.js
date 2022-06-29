"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _immutable = require("immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Modelo de Account.
 *
 * @attribute address       Dirección de la cuenta.
 * @attribute balance       Balance nativo de la cuenta
 * @attribute tokenBalances Balance de los tokens de la cuenta.
 */
class Account {
  constructor() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      address = null,
      balance = new _bignumber.default(0),
      tokenBalances = (0, _immutable.Map)()
    } = data;

    if (data) {
      this._address = address;
      this._balance = balance;
      this._tokenBalances = tokenBalances;
    }
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
  }

  get tokenBalances() {
    return this._tokenBalances;
  }

  set tokenBalances(value) {
    this._tokenBalances = value;
  }

}

var _default = Account;
exports.default = _default;