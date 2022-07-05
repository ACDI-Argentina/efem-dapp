import { BehaviorSubject } from 'rxjs'
import Message, { Severity } from '../models/Message'

/**
 * Manager encargado de manejar los mensajes en la aplicación.
 */
class MessageManager {

  constructor() {
    this.messageSubject = new BehaviorSubject(null);
  }

  /**
   * Registra un nuevo mensaje de éxito.
   */
  addMessageSuccess = ({
    title,
    text
  }) => {
    let message = new Message({
      title: title,
      text: text,
      severity: Severity.SUCCESS
    });
    this.messageSubject.next(message);
  }

  /**
   * Registra un nuevo mensaje de error.
   */
  addMessageError = ({
    title,
    text = '',
    error
  }) => {
    let message = new Message({
      title: title,
      text: text,
      severity: Severity.ERROR,
      error: error
    });
    this.messageSubject.next(message);
  }

  getMessage() {
    return this.messageSubject.asObservable();
  }
}

export default MessageManager;