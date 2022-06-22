import BigNumber from 'bignumber.js'
import { Observable } from 'rxjs'
import transactionStoreUtils from '../../redux/utils/transactionStoreUtils'
import web3Manager from './Web3Manager';
import { ERC20Abi } from '@acdi/avaldao-contract';
import TransactionTracker from './TransactionTracker';
import utilsContractApi from './UtilsContractApi'

/**
 * API encargada de la interacción con ERC20 Smart Contracts.
 * 
 * https://forum.openzeppelin.com/t/making-sure-i-understand-how-safeerc20-works/2940/5
 */
class ERC20ContractApi {

    constructor() {
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
        });
        this.transactionTracker = new TransactionTracker();
    }

    async getBalance(contractAddress, ownerAddress) {
        try {
            const erc20Contract = await this.getERC20Contract(contractAddress);
            const balance = await erc20Contract.methods.balanceOf(ownerAddress).call();
            return new BigNumber(balance);
        } catch (err) {
            console.error("Error obteniendo balance de ERC20 Token.",contractAddress, err);
            return new BigNumber(0);
        }
    }

    approve(contractAddress, spenderAddress, amount, senderAddress) {

        console.log('Approve ERC20 Token.', contractAddress, spenderAddress, amount, senderAddress);
            
        return new Observable(async subscriber => {
            
            const erc20Contract = await this.getERC20Contract(contractAddress);

            const method = erc20Contract.methods.approve(
                spenderAddress,
                amount);

            const gasEstimated = await utilsContractApi.estimateGas(method, senderAddress);
            const gasPrice = await utilsContractApi.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleApproveTokenDonate'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleApproveTokenDonate'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleApproveTokenDonate'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleApproveTokenDonate'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionApproveTokenDonate'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleApproveTokenDonate'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionApproveTokenDonate'
                }
            });

            const onTransactionHash =  async (hash) => { // La transacción ha sido creada.
                    
                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);


                if(this.web3.providerName === "WalletConnect"){
                    try {
                        const receipt = await this.transactionTracker.listenTransactionReceipt(hash);
                        
                        if (receipt) {
                            onConfirmation(undefined, receipt)
                        } else {
                            onError(new Error(`Transaction reverted`))
                        }
                    }  catch(err){
                        console.log(err);
                        onError(new Error(`Transaction reverted`))
                    }
                }

            };

            const onConfirmation = (confNumber, receipt) => {
                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);
                subscriber.next(true);
            }
            const onError = function (error) {
                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);
                subscriber.next(false);
            }

            method.send({from: senderAddress})
                .once('transactionHash',onTransactionHash)
                .once('confirmation', onConfirmation)
                .on('error', onError);
        });
    }

    async getERC20Contract(address) {
        return new this.web3.eth.Contract(ERC20Abi, address);
    }
}

export default new ERC20ContractApi();