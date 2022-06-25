"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _feathers = _interopRequireDefault(require("@feathersjs/feathers"));

var _socketioClient = _interopRequireDefault(require("@feathersjs/socketio-client"));

var _authenticationClient = _interopRequireDefault(require("@feathersjs/authentication-client"));

var _restClient = _interopRequireDefault(require("@feathersjs/rest-client"));

var _socket = _interopRequireDefault(require("socket.io-client/dist/socket.io"));

var _localforage = _interopRequireDefault(require("localforage"));

var _feathersReactive = _interopRequireDefault(require("feathers-reactive"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FeathersClient {
  constructor(config) {
    const restClient = (0, _restClient.default)(config.feathersConnection);

    const fetch = require('node-fetch');

    const socket = (0, _socket.default)(config.feathersConnection, {
      transports: ['websocket']
    }); // socket IO error events

    socket.on('connect_error', _e => console.log('Could not connect to FeatherJS'));
    socket.on('connect_timeout', _e => console.log('Could not connect to FeatherJS: Timeout'));
    socket.on('reconnect_attempt', _e => console.log('Trying to reconnect to FeatherJS: Timeout'));
    const feathersRest = (0, _feathers.default)().configure(restClient.fetch(fetch)).configure((0, _authenticationClient.default)({
      storage: _localforage.default
    })).configure((0, _feathersReactive.default)({
      idField: '_id'
    }));
    this.client = (0, _feathers.default)().configure((0, _socketioClient.default)(socket, {
      timeout: 30000,
      pingTimeout: 30000,
      upgradeTimeout: 30000
    })).configure((0, _authenticationClient.default)({
      storage: _localforage.default
    })).configure((0, _feathersReactive.default)({
      idField: '_id'
    })).on('authenticated', feathersRest.passport.setJWT); // set token on feathersRest whenever it is changed
  }

  getClient() {
    return this.client;
  }

}

var _default = FeathersClient;
exports.default = _default;