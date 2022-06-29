"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _rxjs = require("rxjs");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO Analizar como hacer esta integración de mensajes.
//import messageUtils from '../redux/utils/messageUtils'
class UserService {
  constructor(commonsContext) {
    _defineProperty(this, "saveCurrentUser", user => {
      return new _rxjs.Observable(async subscriber => {
        try {
          // Se almacena en IPFS toda la información del Usuario.
          let infoCid = await this.userIpfsConnector.upload(user);
          user.infoCid = infoCid;

          if (user.registered === false) {
            await this.feathersClient.service('users').create(user.toFeathers()); // Nuevo usuario     

            user.registered = true;
            /*messageUtils.addMessageSuccess({
              title: `Bienvenido`,
              text: `Su perfil ha sido registrado.`
            });*/
          } else {
            // Actualización de usuario
            await this.feathersClient.service('users').update(user.address, user.toFeathers());
            /*messageUtils.addMessageSuccess({
              text: `Su perfil ha sido actualizado.`
            });*/
          }

          subscriber.next(user);
        } catch (error) {
          console.error('[User Service] Error almacenando usuario.', error);
          subscriber.error(error);
          /*messageUtils.addMessageError({
            text: `Se produjo un error almacenando el perfil del usuario.`,
            error: error
          });*/
        }
      });
    });

    _defineProperty(this, "loadUsers", () => {
      return new _rxjs.Observable(async subscriber => {
        const users = [];
        const {
          data: usersData
        } = await this.feathersClient.service("users").find();

        for (let i = 0; i < usersData.length; i++) {
          const user = await this.loadUserByFeathersData(usersData[i]);
          users.push(user);
        }

        subscriber.next(users);
      });
    });

    _defineProperty(this, "loadUserByAddress", address => {
      return new _rxjs.Observable(async subscriber => {
        try {
          const userData = await this.feathersClient.service('/users').get(address);
          const user = await this.loadUserByFeathersData(userData);
          subscriber.next(user);
        } catch (e) {
          if (e.name === 'NotFound') {
            // El usuario no está registrado.
            const user = new _User.default({
              address: address
            });
            subscriber.next(user);
          } else {
            console.error("Error obteniendo usuario por address ".concat(address, "."), e);
            subscriber.error(e);
          }
        }
      });
    });

    _defineProperty(this, "loadUserByFeathersData", async userData => {
      const registered = true;
      const {
        address,
        name,
        email,
        url,
        infoCid
      } = userData;
      let avatarCid;
      let avatar;

      if (infoCid) {
        // Se obtiene la información del usuario desde IPFS.
        const userIpfs = await this.userIpfsConnector.download(infoCid);
        avatarCid = userIpfs.avatarCid;
        avatar = userIpfs.avatar;
      }

      const user = new _User.default({
        address,
        name,
        email,
        url,
        infoCid,
        avatarCid,
        avatar,
        registered
      }); // Se obtienen los roles del usuario desde la blockchain.

      const roles = await this.adminContractApi.getUserRoles(user);
      user.roles = roles;
      return user;
    });

    _defineProperty(this, "saveUser", user => {
      return new _rxjs.Observable(async subscriber => {
        try {
          // Se almacena en IPFS toda la información del Usuario.
          let infoCid = await this.userIpfsConnector.upload(user);
          user.infoCid = infoCid;
          await this.feathersClient.service('users').update(user.address, user.toFeathers()); // ---------------------
          // Tratamiento de roles.
          // Se obtienen los roles actuales del usuario.

          const userRoles = await this.adminContractApi.getUserRoles(user); // Roles a agregar.

          const rolesToAdd = [];

          for (let i = 0; i < user.roles.length; i++) {
            const role = user.roles[i];

            if (!userRoles.some(r => r.value === role.value)) {
              rolesToAdd.push(role);
            }
          } // Roles a eliminar


          const rolesToRemove = [];

          for (let i = 0; i < userRoles.length; i++) {
            const role = userRoles[i];

            if (!user.roles.some(r => r.value === role.value)) {
              rolesToRemove.push(role);
            }
          }

          if (rolesToAdd.length !== 0 || rolesToRemove.length !== 0) {
            // Existen cambios en los roles para almacenar.
            this.adminContractApi.setUserRoles(user, rolesToAdd, rolesToRemove).subscribe(user => {
              /*messageUtils.addMessageSuccess({
                text: `El usuario ${user.name} ha sido actualizado`
              });*/
              subscriber.next(user);
            }, error => {
              console.error('[User Service] Error almacenando roles de usuario.', error);
              subscriber.error(error);
              /*messageUtils.addMessageError({
                text: `Se produjo un error almacenando roles del usuario.`,
                error: error
              });*/
            });
          } else {
            // No existen cambios en los roles para almacenar.

            /*messageUtils.addMessageSuccess({
              text: `El usuario ${user.name} ha sido actualizado`
            });*/
            subscriber.next(user);
          }
        } catch (error) {
          console.error('[User Service] Error almacenando usuario.', error);
          subscriber.error(error);
          /*messageUtils.addMessageError({
            text: `Se produjo un error almacenando el usuario.`,
            error: error
          });*/
        }
      });
    });

    this.feathersClient = commonsContext.feathersClient;
    this.userIpfsConnector = commonsContext.userIpfsConnector;
    this.adminContractApi = commonsContext.adminContractApi;
  }
  /**
   * Almacena el usuario actual.
   * 
   * @param user usuario a guardar.
   */


}

var _default = UserService;
exports.default = _default;