"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = require("../store");

var _currentUserSlice = require("../reducers/currentUserSlice");

/**
 * Clase utilitaria para el manejo del usuario actual a través de Redux.
 */
class CurrentUserUtils {
  /**
   * Obtiene el usuario actual.
   */
  getCurrentUser() {
    return (0, _currentUserSlice.selectCurrentUser)(_store.store.getState());
  }
  /**
   * Carga el usuario actual.
   * 
   * @param accountAddress dirección de la cuenta.
   */


  loadCurrentUser(accountAddress) {
    const action = (0, _currentUserSlice.loadCurrentUser)(accountAddress);

    _store.store.dispatch(action);
  }

  setAuthenticated(isAuthenticated) {
    _store.store.dispatch((0, _currentUserSlice.setAuthenticated)(isAuthenticated));
  }

  /**
   * Limpia el usuario actual.
   */
  clearCurrentUser() {
    const action = (0, _currentUserSlice.clearCurrentUser)();

    _store.store.dispatch(action);
  }
  /**
   * Actualiza el balance del usuario actual.
   * @param balance balance nativo de la cuenta.
   * @param tokenBalances balance de los tokens de la cuenta.
   */


  updateCurrentUserBalance(balance, tokenBalances) {
    const action = (0, _currentUserSlice.updateCurrentUserBalance)({
      balance: balance,
      tokenBalances: tokenBalances
    });

    _store.store.dispatch(action);
  }

}

var _default = new CurrentUserUtils();

exports.default = _default;