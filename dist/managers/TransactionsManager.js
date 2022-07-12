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
class TransactionsManager {
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
      let transactions = this.transactionsSubject.getValue();
      transactions.push(transaction);
      this.transactionsSubject.next(transactions);
      return transaction;
    });

    _defineProperty(this, "updateTransaction", transaction => {
      let transactions = this.transactionsSubject.getValue();
      let index = transactions.findIndex(t => t.clientId === transaction.clientId);

      if (index !== -1) {
        transactions[index] = transaction;
        this.transactionsSubject.next(transactions);
      }

      return transaction;
    });

    this.transactionsSubject = new _rxjs.BehaviorSubject([]);
  }
  /**
   * Registra una nueva transacción.
   */


  getTransactions() {
    return this.transactionsSubject.asObservable();
  }

}

var _default = TransactionsManager;
exports.default = _default;