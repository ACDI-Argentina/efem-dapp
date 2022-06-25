import ImageTools from '../helpers/ImageResizer';
import FeathersClient from '../clients/FeathersClient';

const isIPFS = require('is-ipfs');
const axios = require('axios').default;
const url = require('url');

class IpfsService {

  constructor(config) {
    this.config = config;
    this.feathersClient = new FeathersClient(config);
  }

  /**
   * Upload a json object or Blob to ipfs
   *
   * @param {object|Blob|string} obj Object/Blob to upload to ipfsGateway. The only valid string is a base64 encoded image.
   */
  upload(obj) {
    const { ipfsGateway } = this.config;
    if (!ipfsGateway || ipfsGateway === '') {
      console.log('not uploading to ipfs. missing ipfsGateway url');
      return Promise.resolve();
    }

    let body;
    if (typeof obj === 'string') {
      if (!ImageTools.isImage(obj)) {
        throw new Error('Cant upload string to ipfs');
      }
      body = ImageTools.toBlob(obj);
    } else {
      body =
        obj instanceof Blob ? obj : new Blob([JSON.stringify(obj)], { type: 'application/json' });
    }

    return fetch(`${ipfsGateway}`, {
      method: 'POST',
      body,
    }).then(ipfsResponse => {
      let cid = ipfsResponse.headers.get('Ipfs-Hash');
      if (this.config.ipfsPinningEnabled) {
        return this.feathersClient.getClient().service('/ipfs-pin').create({ cid: cid })
          .then(() => {
            if (ipfsResponse.ok) {
              return `/ipfs/${cid}`;
            } else {
              throw new Error('IPFS Upload error', ipfsResponse);
            }
          })
          .catch(err => {
            throw new Error('IPFS Pinning unsuccessful', err);
          });
      } else {
        console.warn('IPFS Pinning deshabilitado.');
        if (ipfsResponse.ok) {
          return `/ipfs/${cid}`;
        } else {
          throw new Error('IPFS Upload error', ipfsResponse);
        }
      }
    });
  }

  resolveUrl(path) {
    const { ipfsGateway } = this.config;
    if (!isIPFS.path(path)) throw new Error(`${path} is not a valid ipfs path`);
    return url.resolve(ipfsGateway, path);
  }

  async downloadJson(path) {
    const { ipfsGateway } = this.config;
    if (!isIPFS.path(path)) throw new Error(`${path} is not a valid ipfs path`);
    const response = await axios({
      method: 'get',
      url: url.resolve(ipfsGateway, path),
      responseType: 'json'
    });
    return response.data;
  }
}

export default IpfsService;
