"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Severity = void 0;

var _toolkit = require("@reduxjs/toolkit");

/**
 * Severidad de un mensaje
 */
const Severity = {
  INFO: 'Info',
  SUCCESS: 'Success',
  WARN: 'Warn',
  ERROR: 'Error'
};
/**
 * Representa un mensaje en la Dapp.
 */

exports.Severity = Severity;

class Message {
  constructor() {
    let {
      clientId = (0, _toolkit.nanoid)(),
      title,
      text = '',
      severity = Severity.INFO,
      error
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this._clientId = clientId;
    this._title = title;
    this._text = text;
    this._severity = severity;
    this._error = error;
  }
  /**
   * Obtiene un objeto plano para ser almacenado.
   */


  toStore() {
    return {
      clientId: this._clientId,
      title: this._title,
      text: this._text,
      severity: this._severity,
      // El error no es serializado, pero no debería tener consecuencias porque no se modifica.
      error: this._error
    };
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
  }

  get severity() {
    return this._severity;
  }

  set severity(value) {
    this._severity = value;
  }

  get error() {
    return this._error;
  }

  set error(value) {
    this._error = value;
  }

}

var _default = Message;
exports.default = _default;