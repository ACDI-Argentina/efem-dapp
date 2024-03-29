"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _StatusUtils = _interopRequireDefault(require("../utils/StatusUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Representa una transacción en la blockchain de la Dapp.
 */
class Transaction {
  constructor() {
    let {
      clientId = (0, _toolkit.nanoid)(),
      hash: _hash,
      gasEstimated,
      gasPrice,
      submittedTime,
      createdTitle,
      createdSubtitle,
      pendingTitle,
      confirmedTitle,
      confirmedDescription,
      failuredTitle,
      failuredDescription,
      status = Transaction.CREATED.toStore()
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _defineProperty(this, "submit", hash => {
      this.hash = hash;
      this.status = Transaction.PENDING;
      this.submittedTime = Date.now();
    });

    _defineProperty(this, "confirme", () => {
      this.status = Transaction.CONFIRMED;
    });

    _defineProperty(this, "fail", () => {
      this.status = Transaction.FAILURED;
    });

    this._clientId = clientId;
    this._hash = _hash;
    this._gasEstimated = gasEstimated;
    this._gasPrice = gasPrice;
    this._submittedTime = submittedTime;
    this._createdTitle = createdTitle;
    this._createdSubtitle = createdSubtitle;
    this._pendingTitle = pendingTitle;
    this._confirmedTitle = confirmedTitle;
    this._confirmedDescription = confirmedDescription;
    this._failuredTitle = failuredTitle;
    this._failuredDescription = failuredDescription;
    this._status = _StatusUtils.default.build(status.id, status.name, status.isLocal);
  }
  /**
   * Obtiene un objeto plano para ser almacenado.
   */


  toStore() {
    return {
      clientId: this._clientId,
      hash: this._hash,
      gasEstimated: this._gasEstimated,
      gasPrice: this._gasPrice,
      submittedTime: this._submittedTime,
      createdTitle: this._createdTitle,
      createdSubtitle: this._createdSubtitle,
      pendingTitle: this._pendingTitle,
      confirmedTitle: this._confirmedTitle,
      confirmedDescription: this._confirmedDescription,
      failuredTitle: this._failuredTitle,
      failuredDescription: this._failuredDescription,
      status: this._status.toStore()
    };
  }

  static get CREATED() {
    return _StatusUtils.default.build(1, 'Created', true);
  }

  static get PENDING() {
    return _StatusUtils.default.build(2, 'Pending', true);
  }

  static get CONFIRMED() {
    return _StatusUtils.default.build(3, 'Confirmed');
  }

  static get FAILURED() {
    return _StatusUtils.default.build(4, 'Failured');
  }

  get isCreated() {
    return this.status.name === Transaction.CREATED.name;
  }

  get isConfirmed() {
    return this.status.name === Transaction.CONFIRMED.name;
  }

  get isFailured() {
    return this.status.name === Transaction.FAILURED.name;
  }

  get feeEstimated() {
    return this._gasEstimated.multipliedBy(this._gasPrice);
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get hash() {
    return this._hash;
  }

  set hash(value) {
    this._hash = value;
  }

  get gasEstimated() {
    return this._gasEstimated;
  }

  set gasEstimated(value) {
    this._gasEstimated = value;
  }

  get gasPrice() {
    return this._gasPrice;
  }

  set gasPrice(value) {
    this._gasPrice = value;
  }

  get submittedTime() {
    return this._submittedTime;
  }

  set submittedTime(value) {
    this._submittedTime = value;
  }

  get createdTitle() {
    return this._createdTitle;
  }

  set createdTitle(value) {
    this._createdTitle = value;
  }

  get createdSubtitle() {
    return this._createdSubtitle;
  }

  set createdSubtitle(value) {
    this._createdSubtitle = value;
  }

  get pendingTitle() {
    return this._pendingTitle;
  }

  set pendingTitle(value) {
    this._pendingTitle = value;
  }

  get confirmedTitle() {
    return this._confirmedTitle;
  }

  set confirmedTitle(value) {
    this._confirmedTitle = value;
  }

  get confirmedDescription() {
    return this._confirmedDescription;
  }

  set confirmedDescription(value) {
    this._confirmedDescription = value;
  }

  get failuredTitle() {
    return this._failuredTitle;
  }

  set failuredTitle(value) {
    this._failuredTitle = value;
  }

  get failuredDescription() {
    return this._failuredDescription;
  }

  set failuredDescription(value) {
    this._failuredDescription = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }

}

var _default = Transaction;
exports.default = _default;