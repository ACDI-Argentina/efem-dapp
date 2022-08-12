"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _rxjs = require("rxjs");

var _Account = _interopRequireDefault(require("../models/Account"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Manager encargado de manejar la cuenta de una wallet.
 */
class AccountManager {
  constructor(commonsContext) {
    _defineProperty(this, "loadAccount", async accountAddress => {
      if (accountAddress == null) {
        // La cuenta no está definida, por lo que se reinicializa la cuenta.
        this.accountSubject.next(new _Account.default());
      } else {
        console.log("[Account] Carga de cuenta conectada: ".concat(accountAddress));
        let account = this.accountSubject.getValue();
        account.address = accountAddress;
        this.accountSubject.next(account);
        await this.updateAccountBalances(accountAddress);
      }
    });

    _defineProperty(this, "updateAccountBalances", async accountAddress => {
      let account = this.accountSubject.getValue();
      let changed = false;

      try {
        // Se obtiene el balance del token nativo.
        let balance = await this.web3.eth.getBalance(accountAddress);
        balance = new _bignumber.default(balance); // Solo se actualiza si cambió el balance.

        if (!balance.isEqualTo(account.balance)) {
          account.balance = balance;
          account.tokenBalances[this.config.nativeToken.address] = balance;
          changed = true;
          console.log('[Account] Nuevo balance.', this.config.nativeToken.address, balance);
        }
      } catch (error) {
        console.error("[Account] Error al obtener el balance nativo.", error);
      } // Se obtienen los balances de cada ERC20 token.        


      Object.keys(this.config.tokens).map(async tokenKey => {
        try {
          if (this.config.tokens[tokenKey].isNative === false) {
            let tokenAddress = this.config.tokens[tokenKey].address;
            let tokenBalance = await this.erc20ContractApi.getBalance(tokenAddress, accountAddress); // Solo se actualiza si cambió el balance.

            if (!tokenBalance.isEqualTo(account.tokenBalances[tokenAddress])) {
              account.tokenBalances[tokenAddress] = tokenBalance;
              changed = true;
              console.log('[Account] Nuevo balance.', tokenAddress, tokenBalance);
            }
          }
        } catch (e) {
          console.error('[Account] Error obteniendo balance de ERC Token.', this.config.tokens[tokenKey], e);
        }
      });

      if (changed === true) {
        this.accountSubject.next(account);
      }
    });

    this.config = commonsContext.config;
    this.erc20ContractApi = commonsContext.erc20ContractApi;
    this.web3Manager = commonsContext.web3Manager;
    this.accountSubject = new _rxjs.BehaviorSubject(new _Account.default());
    this.web3Manager.getWeb3().subscribe(web3 => {
      this.web3 = web3;
    });
    this.web3Manager.getAccountAddress().subscribe(async accountAddress => {
      await this.loadAccount(accountAddress);
    });
  }

  /**
   * Obtiene la instancia de la cuenta actual.
   * 
   * @returns account 
   */
  getAccount() {
    return this.accountSubject.asObservable();
  }

}

var _default = AccountManager;
exports.default = _default;