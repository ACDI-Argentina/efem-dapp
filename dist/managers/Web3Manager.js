"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.parse-int.js");

var _web = _interopRequireDefault(require("web3"));

var _web3ProvidersHttp = _interopRequireDefault(require("web3-providers-http"));

var _web3modal = _interopRequireWildcard(require("web3modal"));

var _web3Provider = _interopRequireDefault(require("@walletconnect/web3-provider"));

var _rxjs = require("rxjs");

var _IpfsService = _interopRequireDefault(require("../ipfs/IpfsService"));

var _Wallet = _interopRequireDefault(require("../models/Wallet"));

var _History = require("../utils/History");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Manager encargado de manejar el objeto Web3.
 */
class Web3Manager {
  constructor(commonsContext) {
    _defineProperty(this, "connectWeb3ByHttp", () => {
      const provider = new _web3ProvidersHttp.default(this.config.network.nodeUrl, {
        keepAlive: true,
        timeout: this.config.network.timeout
      });
      const web3 = new _web.default(provider);
      web3.providerName = "Http";
      web3.networkId = this.config.network.requiredId;
      web3.walletBrowserRequired = false; // Almacenamiento de Web3

      if (!this.web3Subject) {
        this.web3Subject = new _rxjs.BehaviorSubject(web3);
      } else {
        this.web3Subject.next(web3);
      } // Almacenamiento de la dirección de la cuenta.


      if (!this.accountAddressSubject) {
        this.accountAddressSubject = new _rxjs.BehaviorSubject(null);
      } else {
        this.accountAddressSubject.next(null);
      }

      console.log('[Setup Web3] Conectado por HTTP Provider.', provider);
      console.log('[Setup Web3] Web3.', web3);
      return web3;
    });

    _defineProperty(this, "setWalletConnectProvider", async provider => {
      const walletBrowserRequired = false;
      let walletNetworkId;
      let walletNetworkIsCorrect = false;
      let web3 = new _web.default(provider);
      walletNetworkId = await web3.eth.net.getId();
      web3.providerName = "WalletConnect";
      web3.networkId = walletNetworkId;
      walletNetworkIsCorrect = walletNetworkId === this.config.network.requiredId;

      if (!walletNetworkIsCorrect) {
        // La wallet no está en la red correcta.
        // Se inicializa Web3 a partir de HTTP Provider.
        console.warn("[Setup Web3] Wallet Connect - Red correcta: ".concat(walletNetworkIsCorrect, ".")); // Se fuerza la desconexión del provider.

        await provider.disconnect();
        web3 = this.connectWeb3ByHttp();
      } else {
        console.log('[Setup Web3] Conectado por Wallet Connect.');
      } // Propiedades propias de una wallet.


      web3.wallet = new _Wallet.default({
        name: "WalletConnect",
        logo: this.ipfsService.resolveUrl('/ipfs/QmdgSn7DszmWnF7RWukPQjNYv4SN2qFwxMhrtJ8NYWqRxX'),
        networkId: walletNetworkId
      });
      web3.walletBrowserRequired = walletBrowserRequired;
      this.web3Subject.next(web3);
      console.log('[Setup Web3] Web3.', web3);
      return web3;
    });

    _defineProperty(this, "connect", async (before, after) => {
      try {
        const web3Modal = new _web3modal.default({
          providerOptions: {
            // read more about providers setup in https://github.com/web3Modal/web3modal/
            walletconnect: {
              package: _web3Provider.default,
              // setup wallet connect for mobile wallet support
              options: {
                rpc: {
                  30: 'https://public-node.rsk.co',
                  31: 'https://public-node.testnet.rsk.co',
                  33: this.config.network.nodeUrl
                }
              }
            }
          }
        });
        const provider = await web3Modal.connect();
        let web3;

        if (provider instanceof _web3Provider.default) {
          web3 = this.setWalletConnectProvider(provider);
        } else {
          before(); // ejecutar solo si es una funcion

          web3 = await this.connectWeb3ByWalletBrowser(provider);
          after(); //
        }

        if (web3.providerName === "Http") {
          web3.isFallbackProvider = true;
        }

        return web3;
      } catch (e) {
        console.error('Error conectando wallet.', e);
      }
    });

    _defineProperty(this, "disconnect", async () => {
      let web3 = this.web3Subject.getValue();

      if (web3.providerName === "WalletConnect") {
        await web3.currentProvider.disconnect();
      } else if (web3.providerName === "WalletBrowser") {// No se encontró forma de desconectar una wallet browser.
      }

      console.log('[Setup Web3] Desconectado.'); // Se redirecciona el usuario al home.

      _History.history.push("");

      this.connectWeb3ByHttp();
    });

    _defineProperty(this, "handleWeb3Changed", async web3 => {
      if (web3.providerName !== "Http") {
        // Web3 fue configurado a partir de un provider de una wallet.
        // Se obtiene la cuenta.
        const accounts = await web3.eth.getAccounts();

        if (accounts.length > 0) {
          this.accountAddressSubject.next(accounts[0]);
        } // Se configuran los listener de los EIP-1193 events.
        // https://eips.ethereum.org/EIPS/eip-1193#events-1


        let provider = web3.currentProvider;
        console.log("[Web3] EIP-1193 events listeners de provider ".concat(web3.providerName, "."), provider); // Event connect

        provider.on('connect', connectInfo => {
          console.log('[Web3] Provider event: connect.', connectInfo);
        }); // Event disconnect

        provider.on('disconnect', error => {
          console.log('[Web3] Provider event: disconnect.', error);
          this.connectWeb3ByHttp();
        }); // Event chainChanged

        provider.on("chainChanged", chainId => {
          console.log('[Web3] Provider event: chainChanged.', parseInt(chainId)); // Se recarga la página por recomendación de MetaMask.
          // https://docs.metamask.io/guide/ethereum-provider.html#chainchanged
          // Correctly handling chain changes can be complicated.
          // We recommend reloading the page unless you have good reason not to.

          window.location.reload();
        }); // Event accountsChanged

        provider.on("accountsChanged", async accounts => {
          console.log('[Web3] Provider event: accountsChanged.', accounts);
          /*if (accounts.length > 0) {
            this.accountAddressSubject.next(accounts[0]);
          }*/
          // Al modificarse la cuenta, se desconocta el usuario actual.

          await this.disconnect();
        });
      }
    });

    _defineProperty(this, "getWeb3", () => {
      return this.web3Subject.asObservable();
    });

    _defineProperty(this, "getAccountAddress", () => {
      return this.accountAddressSubject.asObservable();
    });

    this.config = commonsContext.config;
    this.ipfsService = new _IpfsService.default(commonsContext);
    this.connectWeb3ByHttp();
    this.getWeb3().subscribe(async web3 => {
      await this.handleWeb3Changed(web3);
    });
  }
  /**
   * Conecta Web3 con HTTP Provider.
   */


  /**
   * Conecta Web3 a partir la Wallet del Browser si es posible.
   */
  async connectWeb3ByWalletBrowser(provider) {
    let web3 = new _web.default(provider);
    let walletBrowserRequired = true;
    let walletNetworkId = undefined;
    let walletNetworkIsCorrect = false;

    if (provider) {
      walletBrowserRequired = false;

      try {
        const accounts = await web3.eth.getAccounts();
        console.log('[Setup Web3] Browser Wallet accounts.', accounts);

        if (accounts.length > 0) {
          walletNetworkId = await web3.eth.net.getId();
          web3.providerName = "WalletBrowser"; //type

          web3.networkId = walletNetworkId;
          walletNetworkIsCorrect = walletNetworkId === this.config.network.requiredId;
        } else {
          console.warn('[Setup Web3] No hay cuenta habilitada en Browser Wallet.');
        }
      } catch (error) {
        // User denied account access
        console.warn('[Setup Web3] Acceso no autorizado a la dapp en Browser Wallet.');
      }
    }

    if (walletBrowserRequired || !walletNetworkIsCorrect) {
      // La wallet no está instalada o la red es incorrecta.
      // Se inicializa Web3 a partir de HTTP Provider.
      console.warn("[Setup Web3] Wallet Browser - Requerida: ".concat(walletBrowserRequired, "; Red correcta: ").concat(walletNetworkIsCorrect, "."));
      web3 = this.connectWeb3ByHttp();
    } else {
      console.log('[Setup Web3] Conectado por Wallet Browser.');
    }

    const providerInfo = (0, _web3modal.getProviderInfo)(provider);
    console.log('providerInfo', providerInfo);
    web3.wallet = new _Wallet.default({
      name: providerInfo.name,
      logo: providerInfo.logo,
      networkId: walletNetworkId
    });
    web3.walletBrowserRequired = walletBrowserRequired;
    this.web3Subject.next(web3);
    console.log('[Setup Web3] Web3.', web3);
    return web3;
  }

}

var _default = Web3Manager;
exports.default = _default;