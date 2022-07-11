import Wallet from './models/Wallet'
import User from './models/User'

import InputField from './components/InputField';
import OnlyRole from './components/OnlyRole';

import UserService from './services/UserService'
import AuthService from './services/AuthService'

import IpfsService from './ipfs/IpfsService';
import UserIpfsConnector from './ipfs/UserIpfsConnector';

import History from './utils/History';
import ImageResizer from './utils/ImageResizer';
import ValidatorUtils from './utils/ValidatorUtils';

import FeathersClient from './clients/FeathersClient';
import FeathersUsersClient from './clients/FeathersUsersClient';

import Web3Manager from './managers/Web3Manager';
import NetworkManager from './managers/NetworkManager';
import AccountManager from './managers/AccountManager';
import TransactionsManager from './managers/TransactionsManager';
import MessageManager from './managers/MessageManager';

import ERC20ContractApi from './blockchain/api/ERC20ContractApi';
import AdminContractApi from './blockchain/api/AdminContractApi';
import Web3Utils from './blockchain/utils/Web3Utils';

export {

    InputField,
    OnlyRole,
    
    Wallet,
    User,

    FeathersClient,
    FeathersUsersClient,

    UserService,
    AuthService,
    
    IpfsService,
    UserIpfsConnector,
    
    History,
    ImageResizer,
    ValidatorUtils,

    Web3Manager,
    NetworkManager,
    AccountManager,
    TransactionsManager,
    MessageManager,

    ERC20ContractApi,
    AdminContractApi,

    Web3Utils
};