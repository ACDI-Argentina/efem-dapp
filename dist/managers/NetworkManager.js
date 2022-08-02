"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _Network = _interopRequireDefault(require("../models/Network"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Manager encargado de manejar el objeto Web3.
 */
class NetworkManager {
  constructor(commonsContext) {
    _defineProperty(this, "initNetwork", () => {
      const network = new _Network.default({
        id: this.config.network.requiredId,
        name: this.config.network.name
      });
      this.networkSubject = new _rxjs.BehaviorSubject(network);
      console.log('Set Network.', network);
    });

    _defineProperty(this, "getNetworkRequired", () => {
      const networkId = this.config.network.requiredId;
      const networkName = this.getNetworkNameById(networkId);
      let network = new _Network.default({
        id: networkId,
        name: networkName
      });
      return network;
    });

    _defineProperty(this, "getNetworkNameById", networkId => {
      let networkName = '';

      switch (networkId) {
        case 1:
          networkName = 'Main';
          break;

        case 3:
          networkName = 'Ropsten';
          break;

        case 4:
          networkName = 'Rinkeby';
          break;

        case 5:
          networkName = 'Goerli';
          break;

        case 30:
          networkName = 'RSK Mainnet';
          break;

        case 31:
          networkName = 'RSK Testnet';
          break;

        case 33:
          networkName = 'RSK Regtest';
          break;

        case 42:
          networkName = 'Kovan';
          break;

        case '':
          networkName = 'None';
          break;

        default:
          networkName = 'Custom';
          break;
      }

      return networkName;
    });

    this.config = commonsContext.config;
    this.web3Manager = commonsContext.web3Manager;
    this.initNetwork();
    this.web3Manager.getWeb3().subscribe(web3 => {
      // Se actualizó Web3, por lo que se actualiza la red actual.
      let id = web3.networkId;

      if (web3.wallet && web3.wallet.networkId) {
        // Está definida la red desde la Wallet,
        // por lo que se prioriza esta identificación.
        id = web3.wallet.networkId;
      }

      let name = this.getNetworkNameById(id);
      let isCorrect = id === this.config.network.requiredId;
      let network = new _Network.default({
        id: id,
        name: name,
        isCorrect: isCorrect
      });
      this.networkSubject.next(network);
      console.log('[Setup Network] Network.', network);
    });
  }
  /**
   * Inicializa la red.
   */


  /**
   * Obtiene la instancia de Network actual.
   * 
   * @returns web3 
   */
  getNetwork() {
    return this.networkSubject.asObservable();
  }

}

var _default = NetworkManager;
exports.default = _default;