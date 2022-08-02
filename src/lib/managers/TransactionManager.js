import { BehaviorSubject } from 'rxjs'
import Transaction from '../models/Transaction'

/**
 * Manager encargado de manejar las transacciones en la blockchain.
 */
class TransactionManager {

  constructor() {
    this.transactionSubject = new BehaviorSubject(null);
  }

  /**
   * Registra una nueva transacción.
   */
  addTransaction = ({
    hash,
    gasEstimated,
    gasPrice,
    createdTitle,
    createdSubtitle,
    pendingTitle,
    confirmedTitle,
    confirmedDescription,
    failuredTitle,
    failuredDescription
  }) => {
    let transaction = new Transaction({
      hash: hash,
      gasEstimated: gasEstimated,
      gasPrice: gasPrice,
      createdTitle: createdTitle,
      createdSubtitle: createdSubtitle,
      pendingTitle: pendingTitle,
      confirmedTitle: confirmedTitle,
      confirmedDescription: confirmedDescription,
      failuredTitle: failuredTitle,
      failuredDescription: failuredDescription
    });
    this.transactionSubject.next(transaction);
    return transaction;
  }

  updateTransaction = (transaction) => {
    this.transactionSubject.next(transaction);
    return transaction;
  }

  getTransaction() {
    return this.transactionSubject.asObservable();
  }
}

export default TransactionManager;