"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _Transaction = _interopRequireDefault(require("../models/Transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Manager encargado de manejar las transacciones en la blockchain.
 */
class TransactionManager {
  constructor() {
    _defineProperty(this, "addTransaction", _ref => {
      let {
        hash,
        gasEstimated,
        gasPrice,
        createdTitle,
        createdSubtitle,
        pendingTitle,
        confirmedTitle,
        confirmedDescription,
        failuredTitle,
        failuredDescription
      } = _ref;
      let transaction = new _Transaction.default({
        hash: hash,
        gasEstimated: gasEstimated,
        gasPrice: gasPrice,
        createdTitle: createdTitle,
        createdSubtitle: createdSubtitle,
        pendingTitle: pendingTitle,
        confirmedTitle: confirmedTitle,
        confirmedDescription: confirmedDescription,
        failuredTitle: failuredTitle,
        failuredDescription: failuredDescription
      });
      this.transactionSubject.next(transaction);
      return transaction;
    });

    _defineProperty(this, "updateTransaction", transaction => {
      this.transactionSubject.next(transaction);
      return transaction;
    });

    this.transactionSubject = new _rxjs.BehaviorSubject(null);
  }
  /**
   * Registra una nueva transacción.
   */


  getTransaction() {
    return this.transactionSubject.asObservable();
  }

}

var _default = TransactionManager;
exports.default = _default;