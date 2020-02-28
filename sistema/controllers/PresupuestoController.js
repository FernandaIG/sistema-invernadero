require('dotenv').config();//configura las variables de entorno creadas en el archivo .env
import models from '../models/index';
import nodemailer from 'nodemailer';
import pdf from 'html-pdf';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

async function crearPdfEmail(id) {
    console.log("Entro a la funcion de PDF's para el email");
    const reg = await models.Presupuesto.findOne({ _id: id });
    console.log('datos pdf email', reg);
    let detalles = reg.detalles;
    const { nombre } = await models.Persona.findOne({ _id: reg.persona });
    const reg2 = await models.Usuario.findOne({ _id: reg.usuario });
    const today = new Date();

    //Creación del pdf
    ejs.renderFile(path.join(__dirname, '../views/', "presupuesto.ejs"), {
        detalles: detalles,
        today: today,
        nombre: nombre,
        reg2: reg2,
        reg: reg
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            let options = {
                "height": "11.25in",
                "width": "8.5in"
            };
            pdf.create(data, options).toFile("./pdf/presupuestoEmail.pdf", function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("File created successfully");
                }
            });
        }
    });
}

async function eliminarPdf() {
    //Eliminar el pdf creado
    fs.unlink('./pdf/presupuesto.pdf', (err) => {
        if (err) throw err;
        console.log('Pdf eliminado correctamente!!');
    });
}


export default {

    //Metodos de cada ruta
    add: async (req, res, next) => {
        try {

            const reg = await models.Presupuesto.create(req.body);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al agregar un presupuesto'
            });
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await models.Presupuesto.findOne({ _id: req.query._id })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 });
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
                message: 'Ocurrio un error, en la función Query'
            });
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let valor = req.query.valor;//RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas
            const reg = await models.Presupuesto.find({ 'descripcion': new RegExp(valor, 'i') })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error, en la función List'
            });
            next(e);
        }

    },
    //Metodo que envia el pdf
    sendEmail: async (req, res, next) => {
        console.log('Entro a send email');
        try {
            //Creación del pdf para el email
            crearPdfEmail(req.body._id);

            let { persona } = await models.Presupuesto.findOne({ _id: req.body._id });
            let { email } = await models.Persona.findOne({ _id: persona });
            console.log('id Persona', persona);
            console.log('Correo electronico', email);

            let transport = await nodemailer.createTransport({//Variable que almacena las credenciales del servicio de correo electronico, el correo a utilizar y las contrseñas
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            let mailOptions = {
                from: "'Invernadero Secreto de la Montaña' <invernaderosm.20@gmail.com>",
                to: email,
                subject: 'Presupuesto Invernadero Secreto de la Montaña',
                text: 'Funciona',
                attachments: [{
                    filename: 'presupuestoEmail.pdf',
                    path: (path.join(__dirname, '../pdf/', "presupuestoEmail.pdf")),
                    contentType: 'application/pdf'
                }]
            }

            transport.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err);

                    return console.log('Ocurrio un error al enviar el correo electronico');
                }
                else {

                    res.status(200).send({
                        message: 'Correo enviado'
                    });
                    return console.log('Correo enviado!!!');
                }

            });


        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error al enviar el email'
            });
            next(error);
        }

    },
    //Metodo que crea el pdf
    pdf: async (req, res, next) => {

        try {
            console.log("Entro a la funcion de PDF's");
            const reg = await models.Presupuesto.findOne({ _id: req.body._id });
            console.log('reg pfd!!', reg);
            let detalles = reg.detalles;
            const { nombre } = await models.Persona.findOne({ _id: reg.persona });
            const reg2 = await models.Usuario.findOne({ _id: reg.usuario });
            const today = new Date();

            //Creación del pdf
            await ejs.renderFile(path.join(__dirname, '../views/', "presupuesto.ejs"), {
                detalles: detalles,
                today: today,
                nombre: nombre,
                reg2: reg2,
                reg: reg
            }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in"
                    };
                    pdf.create(data, options).toFile("./pdf/presupuesto.pdf", function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send("File created successfully");
                        }
                    });
                }
            });

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al crear el pdf'
            });
            next(e);
        }

    },
    //Metodo que envia el pdf al cliente
    sendPdf: async (req, res, next) => {

        try {

            var file = path.join(__dirname, '../pdf/presupuesto.pdf');
            res.download(file, function (err) {
                if (err) {
                    console.log("Error");
                    console.log(err);
                } else {
                    console.log("Pdf enviado correctamente!!");
                    // eliminarPdf();
                }
            });



        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al enviar el pdf al cliente'
            });

            next(e);
        }
    },
    remove: async (req, res, next) => {
        try {
            const reg = await models.Presupuesto.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al eliminar el presupuesto'
            });
            next(e);
        }
    },
    activate: async (req, res, next) => {

        try {
            const reg = await models.Presupuesto.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al activar'
            });
            next(e);
        }

    },
    deactivate: async (req, res, next) => {

        try {
            const reg = await models.Presupuesto.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al desactivar'
            });
            next(e);
        }

    },
}