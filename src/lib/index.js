import Wallet from './models/Wallet'

import Badge from './components/Badge';
import Button from './components/Button';

import IpfsService from './ipfs/IpfsService';
import UserIpfsConnector from './ipfs/UserIpfsConnector';

import History from './utils/History';
import ImageResizer from './utils/ImageResizer';

import FeathersClient from './clients/FeathersClient';
import FeathersUsersClient from './clients/FeathersUsersClient';

import Web3Manager from './managers/Web3Manager';
import AccountManager from './managers/AccountManager';
import TransactionsManager from './managers/TransactionsManager';

import ERC20ContractApi from './blockchain/api/ERC20ContractApi';
import AdminContractApi from './blockchain/api/AdminContractApi';
import Web3Utils from './blockchain/utils/Web3Utils';

export {
    Wallet,
    Badge,
    Button,

    FeathersClient,
    FeathersUsersClient,

    IpfsService,
    UserIpfsConnector,
    
    History,
    ImageResizer,

    Web3Manager,
    AccountManager,
    TransactionsManager,

    ERC20ContractApi,
    AdminContractApi,

    Web3Utils
};