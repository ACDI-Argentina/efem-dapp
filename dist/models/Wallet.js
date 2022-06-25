"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Modelo de Wallet.
 *
 * @attribute name          Nombre de la wallet.
 * @attribute logo          URL con la imagen del logo de la wallet.
 * @attribute networkId     Identificador de la red de la wallet.
 */
class Wallet {
  constructor() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      name = null,
      logo = null,
      networkId = null
    } = data;

    if (data) {
      this._name = name;
      this._logo = logo;
      this._networkId = networkId;
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get logo() {
    return this._logo;
  }

  set logo(value) {
    this._logo = value;
  }

  get networkId() {
    return this._networkId;
  }

  set networkId(value) {
    this._networkId = value;
  }

}

var _default = Wallet;
exports.default = _default;