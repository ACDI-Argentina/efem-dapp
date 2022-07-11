import { BehaviorSubject } from 'rxjs'
import Network from 'models/Network';

/**
 * Manager encargado de manejar el objeto Web3.
 */
class NetworkManager {

  constructor(commonsContext) {
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
      let network = new Network({
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
  initNetwork = () => {
    const network = new Network({
      id: this.config.network.requiredId,
      name: this.config.network.name
    });
    this.networkSubject = new BehaviorSubject(network);
    console.log('Set Network.', network);
  }

  /**
   * Obtiene la red requerida según la configuración.
   */
  getNetworkRequired = () => {
    const networkId = this.config.network.requiredId;
    const networkName = this.getNetworkNameById(networkId);
    let network = new Network({
      id: networkId,
      name: networkName
    });
    return network;
  };

  /**
   * Obtiene el nombre de la red a partir de su ID.
   * 
   * @param networkId ID de la red
   * @returns Nombre de la Red
   */
  getNetworkNameById = (networkId) => {
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
  }

  /**
   * Obtiene la instancia de Network actual.
   * 
   * @returns web3 
   */
  getNetwork() {
    return this.networkSubject.asObservable();
  }
}

export default NetworkManager;

