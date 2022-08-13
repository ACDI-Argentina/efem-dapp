"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.json.stringify.js");

var _ImageResizer = _interopRequireDefault(require("../utils/ImageResizer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isIPFS = require('is-ipfs');

const axios = require('axios').default;

const url = require('url');

class IpfsService {
  constructor(commonsContext) {
    this.config = commonsContext.config;
    /**
     * Se utiliza el servicio de usuarios para hacer pinning.
     * TODO: esto debe mejorarse y cambiar el servicio de usuarios
     * para que brinde servicios más amplios y comunes.
     */

    this.feathersUsersClient = commonsContext.feathersUsersClient;
  }
  /**
   * Upload a json object or Blob to ipfs
   *
   * @param {object|Blob|string} obj Object/Blob to upload to ipfsGateway. The only valid string is a base64 encoded image.
   */


  upload(obj) {
    const {
      ipfsGateway
    } = this.config;

    if (!ipfsGateway || ipfsGateway === '') {
      console.log('not uploading to ipfs. missing ipfsGateway url');
      return Promise.resolve();
    }

    let body;

    if (typeof obj === 'string') {
      if (!_ImageResizer.default.isImage(obj)) {
        throw new Error('Cant upload string to ipfs');
      }

      body = _ImageResizer.default.toBlob(obj);
    } else {
      body = obj instanceof Blob ? obj : new Blob([JSON.stringify(obj)], {
        type: 'application/json'
      });
    }

    return fetch("".concat(ipfsGateway), {
      method: 'POST',
      body
    }).then(ipfsResponse => {
      let cid = ipfsResponse.headers.get('Ipfs-Hash');

      if (this.config.ipfsPinningEnabled) {
        return this.feathersUsersClient.getClient().service('/ipfs-pin').create({
          cid: cid
        }).then(() => {
          if (ipfsResponse.ok) {
            return "/ipfs/".concat(cid);
          } else {
            throw new Error('IPFS Upload error', ipfsResponse);
          }
        }).catch(err => {
          throw new Error('IPFS Pinning unsuccessful', err);
        });
      } else {
        console.warn('IPFS Pinning deshabilitado.');

        if (ipfsResponse.ok) {
          return "/ipfs/".concat(cid);
        } else {
          throw new Error('IPFS Upload error', ipfsResponse);
        }
      }
    });
  }

  resolveUrl(path) {
    const {
      ipfsGateway
    } = this.config;
    if (!isIPFS.path(path)) throw new Error("".concat(path, " is not a valid ipfs path"));
    return url.resolve(ipfsGateway, path);
  }

  async downloadJson(path) {
    const {
      ipfsGateway
    } = this.config;
    if (!isIPFS.path(path)) throw new Error("".concat(path, " is not a valid ipfs path"));
    const response = await axios({
      method: 'get',
      url: url.resolve(ipfsGateway, path),
      responseType: 'json'
    });
    return response.data;
  }

}

var _default = IpfsService;
exports.default = _default;