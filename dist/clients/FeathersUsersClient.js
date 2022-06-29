"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _socket = _interopRequireDefault(require("socket.io-client/dist/socket.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FeathersUsersClient {
  constructor(commonsContext) {
    this.config = commonsContext.config;
    this.feathersClient = commonsContext.feathersClient;
    const socket = (0, _socket.default)(this.config.feathersUsersConnection, {
      transports: ['websocket']
    }); // socket IO error events

    socket.on('connect_error', _e => console.log('Could not connect to Users FeatherJS'));
    socket.on('connect_timeout', _e => console.log('Could not connect to Users FeatherJS: Timeout'));
    socket.on('reconnect_attempt', _e => console.log('Trying to reconnect to Users FeatherJS: Timeout'));
    this.client = feathers();
    this.client.configure(socketio(socket, {
      timeout: 10000
    }));
    this.client.configure(auth({
      storage: localforage
    }));
    this.client.on('authenticated', async auth => {
      try {
        await this.feathersClient.authenticate(auth);
      } catch (err) {
        console.error("[Feathers Users Client] Error autenticando Feather Client.", err);
        throw err;
      }
    });
    this.client.on('logout', async () => {
      try {
        await this.feathersClient.logout();
      } catch (err) {
        console.error("[Feathers Users Client] Error en logout de Feather Client.", err);
        throw err;
      }
    });
  }

}

var _default = FeathersUsersClient;
exports.default = _default;