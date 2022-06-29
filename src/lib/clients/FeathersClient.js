import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import rest from '@feathersjs/rest-client';
import io from 'socket.io-client/dist/socket.io';
import localforage from 'localforage';
import rx from 'feathers-reactive';

class FeathersClient {

  constructor(commonsContext) {

    this.config = commonsContext.config;
    const restClient = rest(this.config.feathersConnection);
    const fetch = require('node-fetch');

    const socket = io(this.config.feathersConnection, {
      transports: ['websocket'],
    });
    // socket IO error events
    socket.on('connect_error', _e => console.log('Could not connect to FeatherJS'));
    socket.on('connect_timeout', _e => console.log('Could not connect to FeatherJS: Timeout'));
    socket.on('reconnect_attempt', _e => console.log('Trying to reconnect to FeatherJS: Timeout'));

    const feathersRest = feathers()
      .configure(restClient.fetch(fetch))
      .configure(auth({ storage: localforage }))
      .configure(
        rx({
          idField: '_id',
        }),
      );

    this.client = feathers()
      .configure(socketio(socket, { timeout: 30000, pingTimeout: 30000, upgradeTimeout: 30000 }))
      .configure(auth({ storage: localforage }))
      .configure(
        rx({
          idField: '_id',
        }),
      )
      .on('authenticated', feathersRest.passport.setJWT); // set token on feathersRest whenever it is changed
  }

  getClient() {
    return this.client;
  }
}

export default FeathersClient;