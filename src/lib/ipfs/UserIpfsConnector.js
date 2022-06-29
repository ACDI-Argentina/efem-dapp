/**
 * Conector encargado de subir y descargar contenido de Usuarios con IPFS.
 * 
 */
class UserIpfsConnector {

  constructor(commonsContext) {
    this.ipfsService = commonsContext.ipfsService;
  }

  /**
   * Realiza el upload del usuario a IPFS.
   * 
   * @param user a subir a IPFS
   * @return CID del usuario en IPFS
   */
  upload = async (user) => {

    if (user.avatar) {
      // Se almacena en IPFS el avatar del usuario.
      let avatarCid = await this.ipfsService.upload(user.avatar);
      user.avatarCid = avatarCid;
      console.log(avatarCid)
    }
    // Se almacena en IPFS toda la información del usuario.
    let infoCid = await this.ipfsService.upload(user.toIpfs());
    return infoCid;
  }

  /**
   * Descarga la información almacenada del usuario en IPFS.
   * 
   * @param infoCid CID del usuario
   * @return información del usuario en IPFS.
   */
  download = async (infoCid) => {
    const userIpfs = await this.ipfsService.downloadJson(infoCid);
    //const avatar = ipfsService.resolveUrl(userIpfs.avatarCid);
    return {
      avatarCid: userIpfs.avatarCid
    }
  }
}

export default UserIpfsConnector;