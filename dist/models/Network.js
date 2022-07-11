"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Modelo de Network.
 *
 * @attribute id            Identificador de la red.
 * @attribute name          Nombre de la red.
 * @attribute isCorrect     Si la red es la correcta según la requerida.
 */
class Network {
  constructor() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      id = null,
      name = null,
      isCorrect = true
    } = data;

    if (data) {
      this._id = id;
      this._name = name;
      this._isCorrect = isCorrect;
    }
  }

  get id() {
    return this._address;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get isCorrect() {
    return this._isCorrect;
  }

  set isCorrect(value) {
    this._isCorrect = value;
  }

}

var _default = Network;
exports.default = _default;