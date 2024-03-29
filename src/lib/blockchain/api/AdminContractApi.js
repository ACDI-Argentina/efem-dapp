import { Observable } from 'rxjs'
import { AdminAbi } from '@acdi/efem-contract'
import Role from '../../models/Role';

/**
 * API encargada de la interacción con el Admin Smart Contract.
 */
class AdminContractApi {

    constructor(commonsContext) {
        this.config = commonsContext.config;
        this.web3Manager = commonsContext.web3Manager;
        this.accountManager = commonsContext.accountManager;
        this.transactionManager = commonsContext.transactionManager;
        this.web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
            this.updateContracts();
        });
        this.accountManager.getAccount().subscribe(account => {
            this.account = account;
        });
    }

    /**
     * Obtiene los roles de un usuario.
     * 
     * @param user usuario del cual se obtienen los roles.
     */
    getUserRoles = async (user) => {
        const userRoles = [];
        try {
            const roles = this.config.roles;
            for (const role of roles) {
                const hasUserRole = await this.admin.methods.hasUserRole(
                    user.address,
                    role.app,
                    role.hash).call();
                if (hasUserRole === true) {
                    userRoles.push(new Role(role));
                }
            }
        } catch (err) {
            console.error(`[Admin Contract API] Error obteniendo roles del usuario ${user.address}.`, err);
            console.error('[Admin Contract API] Roles.', this.config.roles);
        }
        return userRoles;
    }

    /**
     * Establece los roles del usuario.
     *  
     * @param user sobre el cual se establecen los roles.
     */
    setUserRoles = (user, rolesToAdd, rolesToRemove) => {

        return new Observable(async subscriber => {

            if(!this.account.address) {
                subscriber.error("[Admin Contract API] No existe cuenta para ejecutar la transacción.");
                return;
            }            

            console.log('user, rolesToAdd, rolesToRemove', user, rolesToAdd, rolesToRemove);
            const method = this.admin.methods.setUserRoles(
                user.address,
                rolesToAdd.map(r => r.hash),
                rolesToAdd.map(r => r.app),
                rolesToRemove.map(r => r.hash),
                rolesToRemove.map(r => r.app));

            const gasEstimated = await this.estimateGas(method, this.account.address);
            const gasPrice = await this.getGasPrice();

            let transaction = this.transactionManager.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleSetUserRoles'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleSetUserRoles'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleSetUserRoles'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleSetUserRoles'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionSetUserRoles'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleSetUserRoles'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionSetUserRoles'
                }
            });

            const promiEvent = method.send({
                from: this.account.address
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                this.transactionManager.updateTransaction(transaction);

                subscriber.next(user);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                this.transactionManager.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                //const avalIdEvent = receipt.events['SaveAval'].returnValues.id;

                // Se instruye al store para obtener el aval actualizado.
                //avalStoreUtils.fetchAvalById(avalIdEvent);

                subscriber.next(user);

            }).on('error', function (error) {

                transaction.fail();
                //this.transactionManager.updateTransaction(transaction);

                error.user = user;
                console.error(`Error procesando transacción para configurar roles de usuario.`, error);
                subscriber.error(error);
            });
        });
    }

    updateContracts() {
        const { adminContractAddress } = this.config;
        this.admin = new this.web3.eth.Contract(AdminAbi, adminContractAddress);
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

export default AdminContractApi;