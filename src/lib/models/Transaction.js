import { nanoid } from '@reduxjs/toolkit'
import StatusUtils from '../utils/StatusUtils';

/**
 * Representa una transacción en la blockchain de la Dapp.
 */
class Transaction {

  constructor({
    clientId = nanoid(),
    hash,
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
    status = Transaction.CREATED.toStore(),
  } = {}) {
    this._clientId = clientId;
    this._hash = hash;
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
    this._status = StatusUtils.build(status.id, status.name, status.isLocal);
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

  submit = (hash) => {
    this.hash = hash;
    this.status = Transaction.PENDING;
    this.submittedTime = Date.now();
  }

  confirme = () => {
    this.status = Transaction.CONFIRMED;
  }

  fail = () => {
    this.status = Transaction.FAILURED;
  }

  static get CREATED() {
    return StatusUtils.build(1, 'Created', true);
  }

  static get PENDING() {
    return StatusUtils.build(2, 'Pending', true);
  }

  static get CONFIRMED() {
    return StatusUtils.build(3, 'Confirmed');
  }

  static get FAILURED() {
    return StatusUtils.build(4, 'Failured');
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

export default Transaction;
