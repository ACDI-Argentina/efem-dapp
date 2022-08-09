import BigNumber from 'bignumber.js'
import { Observable } from 'rxjs'
import { ERC20Abi } from '@acdi/efem-contract';

/**
 * API encargada de la interacción con ERC20 Smart Contracts.
 * 
 * https://forum.openzeppelin.com/t/making-sure-i-understand-how-safeerc20-works/2940/5
 */
class ERC20ContractApi {

    constructor(commonsContext) {
        this.web3Manager = commonsContext.web3Manager;
        this.transactionManager = commonsContext.transactionManager;        
        this.web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
        });
        //this.transactionTracker = new TransactionTracker();
    }

    async getBalance(contractAddress, ownerAddress) {
        try {
            const erc20Contract = await this.getERC20Contract(contractAddress);
            const balance = await erc20Contract.methods.balanceOf(ownerAddress).call();
            return new BigNumber(balance);
        } catch (err) {
            console.error("Error obteniendo balance de ERC20 Token.", contractAddress, err);
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

            const gasEstimated = await this.estimateGas(method, senderAddress);
            const gasPrice = await this.getGasPrice();

            let transaction = this.transactionManager.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleApproveToken'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleApproveToken'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleApproveToken'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleApproveToken'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionApproveToken'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleApproveToken'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionApproveToken'
                }
            });

            const onTransactionHash = async (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                this.transactionManager.updateTransaction(transaction);

                // TODO Ver por qué esto está implementado de esta manera, acoplado a Wallet Connect.

                /*if (this.web3.providerName === "WalletConnect") {
                    try {
                        const receipt = await this.transactionTracker.listenTransactionReceipt(hash);

                        if (receipt) {
                            onConfirmation(undefined, receipt)
                        } else {
                            onError(new Error(`Transaction reverted`))
                        }
                    } catch (err) {
                        console.log(err);
                        onError(new Error(`Transaction reverted`))
                    }
                }*/

            };

            const onConfirmation = (confNumber, receipt) => {
                transaction.confirme();
                this.transactionManager.updateTransaction(transaction);
                subscriber.next(true);
            }
            const onError = function (error) {
                transaction.fail();
                this.transactionManager.updateTransaction(transaction);
                subscriber.next(false);
            }

            method.send({ from: senderAddress })
                .once('transactionHash', onTransactionHash)
                .once('confirmation', onConfirmation)
                .on('error', onError);
        });
    }

    async getERC20Contract(address) {
        return new this.web3.eth.Contract(ERC20Abi, address);
    }

    async estimateGas(method, from) {
        const estimateGas = await method.estimateGas({ from: from });
        return new BigNumber(estimateGas);
    }

    async getGasPrice() {
        const gasPrice = await this.web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }
}

export default ERC20ContractApi;