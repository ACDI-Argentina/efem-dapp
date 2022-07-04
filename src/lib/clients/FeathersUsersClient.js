import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client/dist/socket.io';
import localforage from 'localforage';

class FeathersUsersClient {

  constructor(commonsContext) {

    this.config = commonsContext.config;
    this.feathersClient = commonsContext.feathersClient;

    const socket = io(this.config.feathersUsersConnection, {
      transports: ['websocket'],
    });
    // socket IO error events
    socket.on('connect_error', _e => console.log(`Could not connect to Users FeatherJS: ${this.config.feathersUsersConnection}`));
    socket.on('connect_timeout', _e => console.log(`Could not connect to Users FeatherJS. Timeout: ${this.config.feathersUsersConnection}`));
    socket.on('reconnect_attempt', _e => console.log(`Trying to reconnect to Users FeatherJS. Timeout: ${this.config.feathersUsersConnection}`));

    this.client = feathers();
    this.client.configure(socketio(socket, { timeout: 10000 }));
    this.client.configure(auth({ storage: localforage }));

    this.client.on('authenticated', async auth => {
      try {
        await this.feathersClient.getClient().authenticate(auth);
      } catch (err) {
        console.error(`[Feathers Users Client] Error autenticando Feather Client.`, err);
        throw err;
      }
    });

    this.client.on('logout', async () => {
      try {
        await this.feathersClient.getClient().logout();
      } catch (err) {
        console.error(`[Feathers Users Client] Error en logout de Feather Client.`, err);
        throw err;
      }
    });
  }

  getClient() {
    return this.client;
  }
}

export default FeathersUsersClient; 