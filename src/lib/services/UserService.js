import { Observable } from 'rxjs'
import User from '../models/User'
// TODO Analizar como hacer esta integración de mensajes.
//import messageUtils from '../redux/utils/messageUtils'

class UserService {

  constructor(commonsContext) {
    this.feathersUsersClient = commonsContext.feathersUsersClient;
    this.userIpfsConnector = commonsContext.userIpfsConnector;
    this.adminContractApi = commonsContext.adminContractApi;
    this.messageManager = commonsContext.messageManager;
  }

  /**
   * Almacena el usuario actual.
   * 
   * @param user usuario a guardar.
   */
  saveCurrentUser = (user) => {

    return new Observable(async subscriber => {

      try {
        // Se almacena en IPFS toda la información del Usuario.
        let infoCid = await this.userIpfsConnector.upload(user);
        user.infoCid = infoCid;

        if (user.registered === false) {
          await this.feathersUsersClient.getClient().service('users').create(user.toFeathers());
          // Nuevo usuario     
          user.registered = true;
          this.messageManager.addMessageSuccess({
            title: `Bienvenido`,
            text: `Su perfil ha sido registrado.`
          });
        } else {
          // Actualización de usuario
          await this.feathersUsersClient.getClient().service('users').update(user.address, user.toFeathers());
          this.messageManager.addMessageSuccess({
            text: `Su perfil ha sido actualizado.`
          });
        }

        subscriber.next(user);

      } catch (error) {
        console.error('[User Service] Error almacenando usuario.', error);
        subscriber.error(error);
        this.messageManager.addMessageError({
          text: `Se produjo un error almacenando el perfil del usuario.`,
          error: error
        });
      }
    });
  }

  /**
   * Carga los usuarios con sus roles.
   * 
   * TODO Esto deberíamos optimizarlo porque se están cargando todos los usuarios
   * al mismo tiempo y cuando crezca la cantidad habrá problemas de performance.
   * 
   */
  loadUsers = () => {
    return new Observable(async subscriber => {
      const users = [];
      const { data: usersData } = await this.feathersUsersClient.getClient().service("users").find();
      for (let i = 0; i < usersData.length; i++) {
        const user = await this.loadUserByFeathersData(usersData[i]);
        users.push(user);
      }
      subscriber.next(users);
    })
  }

  /**
   * Carga el usuario coincidente con la address.
   * 
   * @param address del usuario.
   */
  loadUserByAddress = (address) => {

    return new Observable(async subscriber => {

      try {

        const userData = await this.feathersUsersClient.getClient().service('/users').get(address);
        const user = await this.loadUserByFeathersData(userData);
        subscriber.next(user);

      } catch (e) {

        if (e.name === 'NotFound') {

          // El usuario no está registrado.
          const user = new User({
            address: address
          });
          subscriber.next(user);

        } else {
          console.error(`Error obteniendo usuario por address ${address}.`, e);
          subscriber.error(e);
        }
      }
    });
  }

  /**
   * Carga las información de un usuario a partir de sus datos básicos obtenidos desde Feathers.
   * 
   * @param userData datos del usuario obtenidos desde Feathers.
   * @return Objeto User con todos los datos del usuario. 
   */
  loadUserByFeathersData = async (userData) => {

    const registered = true;
    const { address, name, email, url, infoCid } = userData;

    let avatarCid;
    let avatar;
    if (infoCid) {
      // Se obtiene la información del usuario desde IPFS.
      const userIpfs = await this.userIpfsConnector.download(infoCid);
      avatarCid = userIpfs.avatarCid;
      avatar = userIpfs.avatar;
    }

    const user = new User({
      address, name, email, url, infoCid, avatarCid, avatar, registered
    });

    // Se obtienen los roles del usuario desde la blockchain.
    const roles = await this.adminContractApi.getUserRoles(user);
    user.roles = roles;

    return user;
  }

  /**
   * Almacena el usuario.
   * 
   * @param user usuario a guardar.
   */
  saveUser = (user) => {

    return new Observable(async subscriber => {

      try {
        // Se almacena en IPFS toda la información del Usuario.
        let infoCid = await this.userIpfsConnector.upload(user);
        user.infoCid = infoCid;

        await this.feathersUsersClient.getClient().service('users').update(user.address, user.toFeathers());

        // ---------------------
        // Tratamiento de roles.

        // Se obtienen los roles actuales del usuario.
        const userRoles = await this.adminContractApi.getUserRoles(user);

        // Roles a agregar.
        const rolesToAdd = [];
        for (let i = 0; i < user.roles.length; i++) {
          const role = user.roles[i];
          if (!userRoles.some(r => r.value === role.value)) {
            rolesToAdd.push(role);
          }
        }

        // Roles a eliminar
        const rolesToRemove = [];
        for (let i = 0; i < userRoles.length; i++) {
          const role = userRoles[i];
          if (!user.roles.some(r => r.value === role.value)) {
            rolesToRemove.push(role);
          }
        }

        if (rolesToAdd.length !== 0 || rolesToRemove.length !== 0) {

          // Existen cambios en los roles para almacenar.
          this.adminContractApi.setUserRoles(user, rolesToAdd, rolesToRemove).subscribe(
            user => {
              /*messageUtils.addMessageSuccess({
                text: `El usuario ${user.name} ha sido actualizado`
              });*/
              subscriber.next(user);
            },
            error => {
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
  }
}

export default UserService;