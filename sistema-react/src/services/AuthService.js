import decode from 'jwt-decode';
import { saveAs } from 'file-saver';

export default class AuthService {
    //Incializar variables importantes
    constructor(domain) {
        this.domain = domain || "http://localhost:3000/api"; //dominio del API server
        this.requestFetch = this.requestFetch.bind(this);

        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(email, password) {
        return this.requestFetch('/usuario/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then(response => {
            if (response.tokenReturn) { // Necesario agregar por que si no intenta logearse si verificacion y sin token correcto
                this.setToken(response.tokenReturn);
                this.setUser(response.user);
            }
            return Promise.resolve(response);
        });
    }
    /**
     * Verificar si existe un token de usuario y sigue siendo valido
     */
    loggedIn() {
        console.debug(this.getToken());
        return !!this.getToken();
    }

    setToken(token) {
        console.log("token setting", token);
        localStorage.setItem('token_id', token);
    }

    getToken() {
        return localStorage.getItem('token_id');
    }

    logout() {
        console.log("logout");
        localStorage.removeItem('token_id');
        localStorage.removeItem('user');
        console.log(this.getToken());
    }

    requestFetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.loggedIn()) {
            headers['token'] = this.getToken();
        }
        return fetch(this.domain + url, {
            headers,
            ...options
        }).then(response => response.json()).catch(error => Promise.reject(error));
    }
    //Request para subir archivos en este caso la imagen del articulo
    requestFetchUpload(url, options) {
        const headers = {

        }

        if (this.loggedIn()) {
            headers['token'] = this.getToken();
        }

        return fetch(this.domain + url, {
            headers,
            ...options
        }).then(response => response.json()).catch(error => Promise.reject(error));
    }
    //Request para descargar el pdf del back
    requestFetchDownload(url, options) {
        const headers = {
            "Content-Type": "application/pdf"
        }
        if (this.loggedIn()) {
            headers['token'] = this.getToken();
        }
        return fetch(this.domain + url, {
            headers,
            ...options
        }).then(res => res.blob()).then(response => {
                //Create a Blob from the PDF Stream
                console.log('response!!',response);
                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
            }).catch(error => Promise.reject(error));
    }


    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        let objStorage = JSON.parse(localStorage.getItem('user'));
        return objStorage;
    }

    setItemCarro(articulo) {
        localStorage.setItem('articulo', JSON.stringify(articulo));
    }

    getItemCarro() {


        return JSON.parse(localStorage.getItem('articulo'));

    }

    VaciarCarro() {

        localStorage.removeItem('articulo');
    }

    Verimagen(from) {
        return this.domain + from;
    }

    getUserAccess() {
        let user = this.getUser();
        if (user) {
            return user.rol;
        } else {
            return false;
        }
    }
    /*_checkStatus(resp){
        if(resp.status){
        }
    }*/

    getProfile() {
        if(this.getToken())
        {
                    return decode(this.getToken());

        }
        else{
            return null;
        }    }
}