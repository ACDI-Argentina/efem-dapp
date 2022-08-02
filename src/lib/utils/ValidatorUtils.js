class ValidatorUtils {

  constructor() {
    this.EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.URL_PATTERN = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  }

  /**
   * Valida que el email sea válido.
   * 
   * @param email a validar
   */
  isValidEmail = (email) => {
    if (!email) {
      return false;
    }
    if (email.match(this.EMAIL_PATTERN)) {
      return true;
    }
    return false;
  }

  /**
   * Valida que la url sea válida.
   * 
   * @param url a validar
   */
  isValidUrl = (url) => {
    if (!url) {
      return false;
    }
    if (this.URL_PATTERN.test(url)) {
      return true;
    }
    return false;
  }

  /**
   * Valida si el texto HTML tiene contenido de texto o no.
   * 
   * @param htmlText a validar
   */
  htmlHasText = (htmlText) => {
    if (htmlText === null ||
      htmlText === undefined ||
      htmlText === '') {
      return false;
    }

    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return htmlText.replace(/(<([^>]+)>)/ig, '') !== '';
  }
}

export default ValidatorUtils;
