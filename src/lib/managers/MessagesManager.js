import { BehaviorSubject } from 'rxjs'
import Message, { Severity } from '../models/Message'

/**
 * Manager encargado de manejar los mensajes en la aplicación.
 */
class MessagesManager {

  constructor() {
    this.messagesSubject = new BehaviorSubject([]);
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
    let messages = this.messagesSubject.getValue();
    messages.put(message);
    this.messagesSubject.next(messages);
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
    let messages = this.messagesSubject.getValue();
    messages.put(message);
    this.messagesSubject.next(messages);
  }

  updateMessage = (message) => {
    let messages = this.messagesSubject.getValue();
    let index = messages.findIndex(m => m.clientId === message.clientId);
    if (index !== -1) {
      messages[index] = message;
      this.messagesSubject.next(messages);
    }
  }

  getMessages() {
    return this.messagesSubject.asObservable();
  }
}

export default MessagesManager;