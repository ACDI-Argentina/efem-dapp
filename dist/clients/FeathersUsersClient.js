"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _feathers = _interopRequireDefault(require("@feathersjs/feathers"));

var _socketioClient = _interopRequireDefault(require("@feathersjs/socketio-client"));

var _authenticationClient = _interopRequireDefault(require("@feathersjs/authentication-client"));

var _socket = _interopRequireDefault(require("socket.io-client/dist/socket.io"));

var _localforage = _interopRequireDefault(require("localforage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FeathersUsersClient {
  constructor(commonsContext) {
    this.config = commonsContext.config;
    this.feathersClient = commonsContext.feathersClient;
    const socket = (0, _socket.default)(this.config.feathersUsersConnection, {
      transports: ['websocket']
    }); // socket IO error events

    socket.on('connect_error', _e => console.log("Could not connect to Users FeatherJS: ".concat(this.config.feathersUsersConnection)));
    socket.on('connect_timeout', _e => console.log("Could not connect to Users FeatherJS. Timeout: ".concat(this.config.feathersUsersConnection)));
    socket.on('reconnect_attempt', _e => console.log("Trying to reconnect to Users FeatherJS. Timeout: ".concat(this.config.feathersUsersConnection)));
    this.client = (0, _feathers.default)();
    this.client.configure((0, _socketioClient.default)(socket, {
      timeout: 10000
    }));
    this.client.configure((0, _authenticationClient.default)({
      storage: _localforage.default
    }));
    this.client.on('authenticated', async auth => {
      try {
        if (this.feathersClient) {
          await this.feathersClient.getClient().authenticate(auth);
        }
      } catch (err) {
        console.error("[Feathers Users Client] Error autenticando Feather Client.", err);
        throw err;
      }
    });
    this.client.on('logout', async () => {
      try {
        if (this.feathersClient) {
          await this.feathersClient.getClient().logout();
        }
      } catch (err) {
        console.error("[Feathers Users Client] Error en logout de Feather Client.", err);
        throw err;
      }
    });
  }

  getClient() {
    return this.client;
  }

}

var _default = FeathersUsersClient;
exports.default = _default;