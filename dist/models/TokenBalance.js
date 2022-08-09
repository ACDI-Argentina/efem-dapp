"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Modelo de Balance de Token.
 */
class TokenBalance {
  constructor() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      address,
      amount = 0,
      rate,
      amountFiat = 0
    } = data;
    this._address = address;
    this._amount = new _bignumber.default(amount);
    this._rate = rate;
    this._amountFiat = new _bignumber.default(amountFiat);
  }
  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */


  toIpfs() {
    return {
      address: this._address,
      amount: this._amount,
      rate: this._rate,
      amountFiat: this._amountFiat
    };
  }
  /**
   * Obtiene un objeto plano para ser almacenado.
   */


  toStore() {
    return {
      address: this._address,
      amount: this._amount,
      rate: this._rate,
      amountFiat: this._amountFiat
    };
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  get amount() {
    return this._amount;
  }

  set amount(value) {
    this._amount = value;
  }

  get rate() {
    return this._rate;
  }

  set rate(value) {
    this._rate = value;
  }

  get amountFiat() {
    return this._amountFiat;
  }

  set amountFiat(value) {
    this._amountFiat = value;
  }

}

var _default = TokenBalance;
exports.default = _default;