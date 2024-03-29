/**
 * Modelo de Network.
 *
 * @attribute id            Identificador de la red.
 * @attribute name          Nombre de la red.
 * @attribute isCorrect     Si la red es la correcta según la requerida.
 */
class Network {

  constructor(data = {}) {
    const {
      id = null,
      name = null,
      isCorrect = true
    } = data;

    if (data) {
      this._id = id;
      this._name = name;
      this._isCorrect = isCorrect;
    }
  }

  get id() {
    return this._address;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get isCorrect() {
    return this._isCorrect;
  }

  set isCorrect(value) {
    this._isCorrect = value;
  }
}

export default Network;
