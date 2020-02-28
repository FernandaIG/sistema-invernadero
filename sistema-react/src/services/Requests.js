import AuthService from "./AuthService";

export default class Requests {
  constructor() {
    this.AuthSrv = new AuthService();
  }

  add(from, data) {
    console.debug(data);
    return this.AuthSrv.requestFetch(from, {
      method: 'POST',
      body: JSON.stringify(data)
    }).catch(this.handleError);
  }

  query(from) {
    return this.AuthSrv.requestFetch(from, {
      method: 'GET'
    }).catch(this.handleError);
  }

  delete(from, id) {
    console.debug(id);
    return this.AuthSrv.requestFetch(from, {
      method: 'DELETE',
      body: JSON.stringify({ _id: id })
    }).catch(this.handleError);
  }

  ActivateOrDeactivate(from, id) {
    return this.AuthSrv.requestFetch(from, {
      method: 'PUT',
      body: JSON.stringify({ _id: id })
    }).catch(this.handleError);
  }

  send(from, id) {
    console.log('Entro al request de envio de correo');
    return this.AuthSrv.requestFetch(from, {
      method: 'POST',
      body: JSON.stringify({ _id: id })
    }).catch(this.handleError);
  }

  createpdf(from, id) {
    console.log('Entro al request de creación del Pdf');
    return this.AuthSrv.requestFetch(from, {
      method: 'POST',
      body: JSON.stringify({ _id: id })
    }).catch(this.handleError);
  }

  pdf(from) {
    console.log('Entro al request de envio del Pdf al cliente');
    return this.AuthSrv.requestFetchDownload(from, {
      method: 'GET',
    }).catch(this.handleError);
  }

  update(from, data) {
    return this.AuthSrv.requestFetch(from, {
      method: 'PUT',
      body: JSON.stringify(data)
    }).catch(this.handleError);
  }

  upload(from, data) {

    return this.AuthSrv.requestFetchUpload(from, {
      method: 'POST',
      body: data
    }).catch(this.handleError);;
  }

  checkout(from, data) {
    console.debug(data);
    return this.AuthSrv.requestFetch(from, {
      method: 'POST',
      body: JSON.stringify(data)
    }).catch(this.handleError);
  }

  list(from, valor = "") {
    if (valor) {
      from += "?valor=" + valor;
    }
    return this.AuthSrv.requestFetch(from, {
      method: 'GET'
    }).catch(this.handleError);
  }

  listCategoria(from) {
    return this.AuthSrv.requestFetch(from, {
      method: 'GET',
    }).catch(this.handleError);
  }

  handleError(error) {
    console.error("Error en request ", error);
    return Promise.resolve(false);
  }

  VerImagen(from) {
    return this.AuthSrv.Verimagen(from);
  }

}