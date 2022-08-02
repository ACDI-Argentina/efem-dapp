"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Representa el tipo de cambio en USD de un token para una fecha y hora.
 */
class ExchangeRate {
  constructor() {
    let {
      clientId = (0, _toolkit.nanoid)(),
      tokenAddress = '',
      rate = new _bignumber.default(1),
      date
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this._clientId = clientId;
    this._tokenAddress = tokenAddress;
    this._rate = rate; // USD por Token.

    this._date = date; // Fecha y hora del tipo de cambio.
  }
  /**
   * Obtiene un objeto plano para ser almacenado.
   */


  toStore() {
    return {
      clientId: this._clientId,
      tokenAddress: this._tokenAddress,
      rate: this._rate,
      date: this._date
    };
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get tokenAddress() {
    return this._tokenAddress;
  }

  set tokenAddress(value) {
    this._tokenAddress = value;
  }

  get rate() {
    return this._rate;
  }

  set rate(value) {
    this._rate = value;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
  }

}

var _default = ExchangeRate;
exports.default = _default;