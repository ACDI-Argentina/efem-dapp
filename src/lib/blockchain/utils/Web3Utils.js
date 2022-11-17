import BigNumber from 'bignumber.js';
import { utils } from 'web3';

class Web3Utils {

  constructor(commonsContext) {
    this.config = commonsContext.config;
  }

  /**
   * Convierte los Wei pasados como parámetro en una cantidad de Ether.
   *
   * @param weiAmount cantidad de wei a converir a en Ether.
   * @returns equivalente en Ether de los Wei pasado como parámetro.
   */
  weiToEther = (weiAmount) => {
    return new BigNumber(utils.fromWei(weiAmount.toFixed()));
  }

  /**
   * Convierte los Ether pasados como parámetro en una cantidad de Wei.
   *
   * @param etherAmount cantidad de Ether a converir a en Wei.
   * @returns equivalente en Wei de los Ether pasado como parámetro.
   */
  etherToWei = (etherAmount) => {
    let value = etherAmount;
    if (!(etherAmount instanceof String)) {
      value = etherAmount.toString();
    }
    return new BigNumber(utils.toWei(value));
  }

  addressEquals = (address1, address2) => {
    let checksumAddress1 = this.toChecksumAddress(address1);
    let checksumAddress2 = this.toChecksumAddress(address2);
    return checksumAddress1 !== null &&
      checksumAddress2 !== null &&
      checksumAddress1 === checksumAddress2;
  }

  abbreviateAddress = (address) => {
    if (address) {
      let first = address.substring(0, 6);
      let middle = '...';
      let last = address.substring(address.length - 4, address.length);
      return first + middle + last;
    }
    return null;
  }

  toKeccak256 = (value) => {
    return utils.keccak256(value);
  }

  /**
   * Determina si un address es válido.
   */
  isValidAddress = (address) => {
    return utils.isAddress(address);
  }

  /**
   * Checksum Address Encoding
   * 
   * https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
   * 
   */
  toChecksumAddress = (address) => {
    if (address == null && address == undefined) {
      return null;
    }
    const chainId = this.config.network.requiredId;
    const strip_address = this.stripHexPrefix(address).toLowerCase()
    const prefix = chainId != null ? (chainId.toString() + '0x') : ''
    const keccak_hash = utils.keccak256(prefix + strip_address).toString('hex')
    let output = '0x'
    for (let i = 0; i < strip_address.length; i++) {
      output += parseInt(keccak_hash[i], 16) >= 8 ?
        strip_address[i].toUpperCase() :
        strip_address[i]
    }
    return output
  }

  stripHexPrefix = (address) => {
    if (address != null && address != undefined && address.startsWith('0x')) {
      return address.slice(2);
    }
    return address;
  }
}

export default Web3Utils;
