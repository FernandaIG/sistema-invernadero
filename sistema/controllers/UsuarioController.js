import models from '../models/index';
import bcrypt from 'bcryptjs';
import token from '../services/token';
import nodemailer from 'nodemailer';
// import encrypt from 'encryptjs';

async function correoContra(reg) {
    console.log("Entro a la funcion que envia la contraseña", reg);

    let { nombre, email } = await models.Usuario.findOne({ _id: reg._id });

    let transport = await nodemailer.createTransport({//Variable que almacena las credenciales del servicio de correo electronico, el correo a utilizar y las contrseñas
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let info = {
        from: "'Invernadero El Secreto de la Montaña' <invernaderosm.20@gmail.com>",
        to: email,
        subject: 'Recuperación de contraseña invernadero El Secreto de la Montaña',
        html: `
        <!doctype html>
        <html>
           <head>
                <meta charset="utf-8">
                <title>Recuperación de contraseña</title>
                <style>
                    h1 {
                        color: green;
                    }
                </style>
            </head>
            <body>
                <div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">
                    <p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"><a href="https://anartz-mugika.com" target="_blank">https://anartz-mugika.com</a></p>
                    <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p>
                </div>
                <h1>Recuperación de contraseña</h1>
                <p>Hola ${nombre}, tu nueva contraseña es <b>12345678</b> </p>
                <p>Te recomendamos cambiar tu contraseña cuanto inicies sesión</p>
                <p>Invernadero "El Secreto de la Montaña"</p>
            </body>
        </html>
    `
    }

    await transport.sendMail(info, (err, data) => {
        if (err) {
            console.log(err);

            return console.log('Ocurrio un error al enviar el correo electronico con la recuperacion de contraseña');
        }
        return console.log('Correo enviado!!!');
    });
}


export default {

    //Metodos de cada ruta

    add: async (req, res, next) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const reg = await models.Usuario.create(req.body);

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    query: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findOne({ _id: req.query._id });

            // let pass = await encrypt(reg.password);

            // const r = await models.Usuario.findByIdAndUpdate({ _id: req.query._id },{password:pass});

            // const re = await models.Usuario.findOne({ _id: req.query._id });
            if (!reg) {
                res.status(404).send({
                    message: 'El registro no existe'
                });
            }
            else {
                res.status(200).json(reg);
            }

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    list: async (req, res, next) => {
        try {
            let valor = req.query.valor;//RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas, el siguiente campo es para ocultar campos de la tabla en este caso el createdAt
            const reg = await models.Usuario.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'email': new RegExp(valor, 'i') }] }, { createdAt: 0 }).sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    update: async (req, res, next) => {

        try {
            let pas = req.body.password;
            // console.log(req.body._id);
            const reg0 = await models.Usuario.findOne({ _id: req.body._id });
            if (pas != reg0.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);

            }

            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { rol: req.body.rol, nombre: req.body.nombre, usuario: req.body.usuario, email: req.body.email, telefono: req.body.telefono, direccion: req.body.direccion, password: req.body.password });
            // res.status(200).json(reg);
            res.status(200).send({
                message: 'Usuario editado'
            });

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    remove: async (req, res, next) => {

        try {

            const reg = await models.Usuario.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    activate: async (req, res, next) => {

        try {
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    deactivate: async (req, res, next) => {

        try {
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    //req es la peticion que se hara en este caso al body, res es la respuesta que dara esta funcion
    //next es para que pase a la siguiente funcion
    login: async (req, res, next) => {
        try {              //Buscara un registro donde el email sea el que se encuentra en el body
            // En el campo de email del formulario del frontend
            let user = await models.Usuario.findOne({ email: req.body.email });
            if (user) {
                // Existe un usuario con ese email
                //bcript se usa para encriptar o desencriptar la contraseña
                //la funcion compare recibe dos parametros(la contraseña ingresada en el formulario del fronend
                //y la contraseña del usuario en la base de datos)
                let match = await bcrypt.compare(req.body.password, user.password);
                if (match) {
                    //la funcion encode genera el codigo del token y recibe el id del usuario para generar un 
                    //token con ese id
                    let tokenReturn = await token.encode(user._id);
                    res.status(200).json({ user, tokenReturn });
                } else {
                    res.status(404).send({
                        message: 'Contraseña Incorrecta'
                    });
                }

            }
            else {
                // El usurio no existe
                res.status(404).send({
                    message: 'No existe el usuario'
                })
            }

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    recuperacionPass: async (req, res, next) => {
        try {

            const reg = await models.Usuario.findOne({ email: req.body.email });
            console.log("Email ", reg);

            //actualizar contraseña
            let contra = "12345678";

            //Si existe la contraseña se encripta y se hace el update
            if (reg.password) {
                console.log("entro al if");
                contra = await bcrypt.hash(contra, 10);

            }

            const reg1 = await models.Usuario.findByIdAndUpdate({ _id: reg._id }, { password: contra });

            //Se crea el correo y se envia al correo
            correoContra(reg1);

            res.status(200).json(reg);

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error al recuperar la contraseña'
            });
            next(error);
        }
    }

}