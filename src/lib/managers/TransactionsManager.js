import { BehaviorSubject } from 'rxjs'
import Transaction from '../models/Transaction'

/**
 * Manager encargado de manejar las transacciones en la blockchain.
 */
class TransactionsManager {

  constructor() {
    this.transactionsSubject = new BehaviorSubject([]);
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
    let transactions = this.transactionsSubject.getValue();
    transactions.push(transaction);
    this.transactionsSubject.next(transactions);
    return transaction;
  }

  updateTransaction = (transaction) => {
    let transactions = this.transactionsSubject.getValue();
    let index = transactions.findIndex(t => t.clientId === transaction.clientId);
    if (index !== -1) {
      transactions[index] = transaction;
      this.transactionsSubject.next(transactions);
    }
    return transaction;
  }

  getTransactions() {
    return this.transactionsSubject.asObservable();
  }
}

export default TransactionsManager;