"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _Message = _interopRequireWildcard(require("../models/Message"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Manager encargado de manejar los mensajes en la aplicación.
 */
class MessageManager {
  constructor() {
    _defineProperty(this, "addMessageSuccess", _ref => {
      let {
        title,
        text
      } = _ref;
      let message = new _Message.default({
        title: title,
        text: text,
        severity: _Message.Severity.SUCCESS
      });
      this.messageSubject.next(message);
    });

    _defineProperty(this, "addMessageError", _ref2 => {
      let {
        title,
        text = '',
        error
      } = _ref2;
      let message = new _Message.default({
        title: title,
        text: text,
        severity: _Message.Severity.ERROR,
        error: error
      });
      this.messageSubject.next(message);
    });

    this.messageSubject = new _rxjs.BehaviorSubject(null);
  }
  /**
   * Registra un nuevo mensaje de éxito.
   */


  getMessage() {
    return this.messageSubject.asObservable();
  }

}

var _default = MessageManager;
exports.default = _default;