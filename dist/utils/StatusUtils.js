"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Status = _interopRequireDefault(require("../models/Status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Clase utilitaria para el manejo de estados.
 */
class StatusUtils {
  /**
   * Construye un objeto de estado.
   *
   * @param id id del estado
   * @param name nombre del estado
   * @param isLocal indica si el estado es local de la Dapp.
   * @returns objeto status
   */
  static build(id, name) {
    let isLocal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return new _Status.default({
      id,
      name,
      isLocal
    });
  }

}

var _default = StatusUtils;
exports.default = _default;