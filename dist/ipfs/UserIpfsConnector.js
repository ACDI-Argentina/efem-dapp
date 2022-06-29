"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Conector encargado de subir y descargar contenido de Usuarios con IPFS.
 * 
 */
class UserIpfsConnector {
  constructor(commonsContext) {
    _defineProperty(this, "upload", async user => {
      if (user.avatar) {
        // Se almacena en IPFS el avatar del usuario.
        let avatarCid = await this.ipfsService.upload(user.avatar);
        user.avatarCid = avatarCid;
        console.log(avatarCid);
      } // Se almacena en IPFS toda la información del usuario.


      let infoCid = await this.ipfsService.upload(user.toIpfs());
      return infoCid;
    });

    _defineProperty(this, "download", async infoCid => {
      const userIpfs = await this.ipfsService.downloadJson(infoCid); //const avatar = ipfsService.resolveUrl(userIpfs.avatarCid);

      return {
        avatarCid: userIpfs.avatarCid
      };
    });

    this.ipfsService = commonsContext.ipfsService;
  }
  /**
   * Realiza el upload del usuario a IPFS.
   * 
   * @param user a subir a IPFS
   * @return CID del usuario en IPFS
   */


}

var _default = UserIpfsConnector;
exports.default = _default;