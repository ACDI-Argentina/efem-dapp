import React from "react";
import ConnectionModalUtil from "./ConnectionModalsUtil";
import config from '../../configuration';
import BigNumber from 'bignumber.js';
import { history } from '../helpers';
import { utils } from 'web3';
import web3Manager from "./Web3Manager";
import networkManager from "./NetworkManager";
import accountManager from "./AccountManager";
import authService from "services/AuthService";

export const Web3AppContext = React.createContext({
  contract: {},
  account: {},
  web3: {},
  walletBrowserRequired: {},
  network: {},
  networkRequired: {},
  transactions: {},
  checkPreflight: () => { },
  loginAccount: () => { },
  accountValidated: {},
  accountValidationPending: {},
  explorer: config.network.explorer,
  lastNotificationTs: undefined,
  modals: {
    data: {
      noWeb3BrowserModalIsOpen: {},
      noWalletModalIsOpen: {},
      connectionModalIsOpen: {},
      accountConnectionPending: {},
      accountSignatureRequest: {},
      userRejectedConnect: {},
      accountValidationPending: {},
      userRejectedValidation: {},
      wrongNetworkModalIsOpen: {},
      transactionConnectionModalIsOpen: {},
      lowFundsModalIsOpen: {},
    },
    methods: {
      openNoWeb3BrowserModal: () => { },
      closeNoWeb3BrowserModal: () => { },
      closeConnectionPendingModal: () => { },
      openConnectionPendingModal: () => { },
      closeUserRejectedConnectionModal: () => { },
      openUserRejectedConnectionModal: () => { },
      closeValidationPendingModal: () => { },
      openValidationPendingModal: () => { },
      closeUserRejectedValidationModal: () => { },
      openUserRejectedValidationModal: () => { },
      closeWrongNetworkModal: () => { },
      openWrongNetworkModal: () => { },
      closeTransactionConnectionModal: () => { },
      closeLowFundsModal: () => { },
      openLowFundsModal: () => { },
      bounceNotification: () => { },
    }
  }
});

class Web3App extends React.Component {
  static Consumer = Web3AppContext.Consumer;

  constructor(props) {
    super(props);
    // Se carga la red requerida
    let networkRequired = networkManager.getNetworkRequired();
    this.state = {
      contract: {},
      account: {},
      web3: {},
      web3Provider: null,
      walletBrowserRequired: null,
      network: {},
      networkRequired: networkRequired,
      transactions: {},
      checkPreflight: this.checkPreflight,
      loginAccount: this.loginAccount,
      logoutAccount: this.logoutAccount,
      accountValidated: null,
      accountValidationPending: null,
      explorer: config.network.explorer,
      modals: {
        data: {
          noWeb3BrowserModalIsOpen: this.noWeb3BrowserModalIsOpen,
          noWalletModalIsOpen: this.noWalletModalIsOpen,
          connectionModalIsOpen: null,
          accountConnectionPending: null,
          accountSignatureRequest: null,
          userRejectedConnect: null,
          accountValidationPending: null,
          userRejectedValidation: null,
          wrongNetworkModalIsOpen: null,
          transactionConnectionModalIsOpen: null,
          lowFundsModalIsOpen: null,
        },
        methods: {
          openNoWeb3BrowserModal: this.openNoWeb3BrowserModal,
          closeNoWeb3BrowserModal: this.closeNoWeb3BrowserModal,
          openNoWalletModal: this.openNoWalletModal,
          closeNoWalletModal: this.closeNoWalletModal,
          closeConnectionModal: this.closeConnectionModal,
          closeSignatureRequestModal: this.closeSignatureRequestModal,
          openConnectionModal: this.openConnectionModal,
          closeConnectionPendingModal: this.closeConnectionPendingModal,
          openConnectionPendingModal: this.openConnectionPendingModal,
          closeUserRejectedConnectionModal: this.closeUserRejectedConnectionModal,
          openUserRejectedConnectionModal: this.openUserRejectedConnectionModal,
          closeValidationPendingModal: this.closeValidationPendingModal,
          openValidationPendingModal: this.openValidationPendingModal,
          closeUserRejectedValidationModal: this.closeUserRejectedValidationModal,
          openUserRejectedValidationModal: this.openUserRejectedValidationModal,
          closeWrongNetworkModal: this.closeWrongNetworkModal,
          openWrongNetworkModal: this.openWrongNetworkModal,
          closeTransactionConnectionModal: this.closeTransactionConnectionModal,
          closeLowFundsModal: this.closeLowFundsModal,
          openLowFundsModal: this.openLowFundsModal,
          authenticateIfPossible: this.authenticateIfPossible,
          checkProfile: this.checkProfile,
          checkBalance: this.checkBalance,
          bounceNotification: this.bounceNotification,
        }
      }
    };
  }

  componentDidMount() {

    web3Manager.getWeb3().subscribe(async web3 => {
      this.web3 = web3;
      this.setState({
        web3: web3,
        walletBrowserRequired: web3.walletBrowserRequired
      });
    });

    networkManager.getNetwork().subscribe(network => {
      this.setState({
        network: network
      });
    });

    accountManager.getAccount().subscribe(account => {
      this.setState({
        account: account
      });
    });
  }

  loginAccount = async () => {
    try {
      const before = this.openConnectionPendingModal;
      const after = this.closeConnectionPendingModal;

      const web3 = await web3Manager.connect(before, after);
      const account = (await web3.eth.getAccounts())[0];

      return web3.isFallbackProvider ? false : account;
      
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  logoutAccount = async () => {
    await web3Manager.disconnect();
    await authService.logout();
  }

  // CONNECTION MODAL METHODS
  closeConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.connectionModalIsOpen = false;
    console.log("this.state", this.state);
    this.setState({ modals });
  };

  openConnectionModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      console.log(e);
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.connectionModalIsOpen = true;
    this.setState({ modals: modals, callback: callback });
  };

  closeConnectionPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    this.setState({ modals });
  };

  openConnectionPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = true;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.connectionModalIsOpen = false;

    this.setState({ modals });
  };

  closeSignatureRequestModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountSignatureRequest = false;
    this.setState({ modals });
  };

  openSignatureRequestModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountSignatureRequest = true;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.connectionModalIsOpen = false;

    this.setState({ modals });
  };

  closeUserRejectedConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedConnect = false;
    this.setState({ modals });
  };

  openUserRejectedConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedConnect = true;
    this.setState({ modals });
  };

  closeValidationPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountValidationPending = false;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openValidationPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.accountValidationPending = true;
    modals.data.userRejectedValidation = false;
    this.setState({ modals });
  };

  closeUserRejectedValidationModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = false;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openUserRejectedValidationModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = true;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  closeNoWeb3BrowserModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWeb3BrowserModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWeb3BrowserModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWeb3BrowserModalIsOpen = true;
    this.setState({ modals });
  };

  closeNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = true;
    this.setState({ modals });
  };

  closeNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = true;
    this.setState({ modals });
  };

  closeWrongNetworkModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.wrongNetworkModalIsOpen = false;
    this.setState({ modals });
  };

  openWrongNetworkModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.wrongNetworkModalIsOpen = true;
    this.setState({ modals });
  };

  closeTransactionConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  closeLowFundsModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.lowFundsModalIsOpen = false;
    this.setState({ modals });
  };

  openLowFundsModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.lowFundsModalIsOpen = true;
    this.setState({ modals, callback: callback });
  };

  //Re render en el child, usando un ts
  bounceNotification = () => {
    this.setState({ lastNotificationTs: Date.now() });
  }

  checkProfile = async (currentUser) => {
    // already created a profile
    if (!currentUser || currentUser.name) return;
    const redirect = await React.swal({
      title: 'Please Register!',
      text: 'It appears that you have not yet created your profile. In order to gain the trust of givers, we strongly recommend creating your profile!',
      icon: 'info',
      buttons: ['Skip', 'Create My Profile!'],
    });
    if (redirect) history.push('/profile');
  };

  checkBalance = (balance) => {
    new Promise(resolve => {
      const minimumWalletBalance = 0.000005;
      const minimumWalletBalanceInWei = new BigNumber(
        utils.toWei(new BigNumber(minimumWalletBalance).toString()),
      );
      if (balance && balance.gte(minimumWalletBalanceInWei)) {
        resolve();
      } else {
        React.swal({
          title: 'Insufficient wallet balance',
          content: React.swal.msg(
            <p>
              Unfortunately you need at least {minimumWalletBalance} {config.nativeTokenName} in
              your wallet to continue. Please transfer some ${config.nativeTokenName} to your wallet
              first.
            </p>,
          ),
          icon: 'warning',
        });
      }
    });
  };


  componentWillUnmount() {
    if (this.web3Provider === "WalletConnect") { //TODO: Mover esta logica a web3Manager
      this.web3ProviderRef && this.web3ProviderRef.current.disconnect();
    }
  }

  render() {
    return (
      <div>
        <Web3AppContext.Provider value={this.state} {...this.props} />
        <ConnectionModalUtil
          loginAccount={this.state.loginAccount}
          account={this.state.account.address}
          accountConnectionPending={this.state.accountConnectionPending}
          accountSignatureRequest={this.state.accountSignatureRequest}
          accountValidationPending={this.state.accountValidationPending}
          accountValidated={this.state.accountValidated}
          network={this.state.network}
          networkRequired={this.state.networkRequired}
          modals={this.state.modals}
        />
      </div>
    );
  }
}

export default Web3App;