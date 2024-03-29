import { nanoid } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js';

/**
 * Representa el tipo de cambio en USD de un token para una fecha y hora.
 */
class ExchangeRate {

  constructor({
    clientId = nanoid(),
    tokenAddress = '',
    rate = new BigNumber(1),
    date
  } = {}) {
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

export default ExchangeRate;