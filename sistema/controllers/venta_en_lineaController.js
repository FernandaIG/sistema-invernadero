import models from '../models/index';
import nodemailer from 'nodemailer';

const stripe = require('stripe')('sk_test_yrK0FsGNh0b1s9POHEtTBfmm00Vu7RTmaK');


async function aumentarStock(idarticulo, cantidad) {
    let { stock } = await models.Articulo.findOne({ _id: idarticulo });
    let nStock = parseInt(stock) + parseInt(cantidad);
    const reg = await models.Articulo.findByIdAndUpdate({ _id: idarticulo }, { stock: nStock });
    const reg2= await models.Articulo.findByIdAndUpdate({_id:idarticulo},{estado:1});

}

async function disminuirStock(idarticulo, cantidad) {
    let { stock } = await models.Articulo.findOne({ _id: idarticulo });
    let nStock = parseInt(stock) - parseInt(cantidad);
    if (nStock==0){
        const reg= await models.Articulo.findByIdAndUpdate({_id:idarticulo},{stock:nStock});
        const reg2= await models.Articulo.findByIdAndUpdate({_id:idarticulo},{estado:0});
   }

   if (nStock>=1){
       const reg= await models.Articulo.findByIdAndUpdate({_id:idarticulo},{stock:nStock});
  }}
//Función 
async function enviarConfrmacion(email, usuario) {

    console.log("correo de envio e confirmacion de compra", email);

    let { nombre } = await models.Usuario.findOne({ _id: usuario });

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
        subject: 'Confirmación Invernadero Secreto de la Montaña',
        html: `
        <!doctype html>
        <html>
           <head>
                <meta charset="utf-8">
                <title>PDF Result Template</title>
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
                <h1>Comfirmación de compra</h1>
                <p>Hola ${nombre} mediante este correo se hace la confirmacion de tu compra, en breve recibiras un correo electronico con el
                número de guía de tu pedido.</p>
                <p>Gracias por tu compra</p>
                <p>Invernadero "El Secreto de la Montaña"</p>
            </body>
        </html>
    `
    }

    await transport.sendMail(info, (err, data) => {
        if (err) {
            console.log(err);

            return console.log('Ocurrio un error al enviar el correo electronico');
        }
        return console.log('Correo enviado!!!');
    });
}

async function estadoCorreo(idVenta) {
    console.log('correo', idVenta);
    let mensaje = 'Enviado';
    const reg = await models.Venta_en_linea.findByIdAndUpdate({ _id: idVenta }, { estado: mensaje });
}

export default {

    //Metodos de cada ruta

    query: async (req, res, next) => {
        try {
            const reg = await models.Venta_en_linea.findOne({ _id: req.query._id })
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
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let valor = req.query.valor;//RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas
            const reg = await models.Venta_en_linea.find({ $or: [{ 'descripcion': new RegExp(valor, 'i') }, { 'descripcion': new RegExp(valor, 'i') }] })
                .populate('usuario', { nombre: 1 })
                .sort({ 'createdAt': -1 });
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
            console.log("update venta_en_linea", req.body._id);
            console.log("update ", req.body.numero_guia);
            const reg = await models.Venta_en_linea.findByIdAndUpdate({ _id: req.body._id }, { numero_guia: req.body.numero_guia });

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    remove: async (req, res, next) => {

        try {

            const reg = await models.Venta_en_linea.findByIdAndDelete({ _id: req.body._id });
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
            const reg = await models.Venta_en_linea.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
            //Actualizar stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad);
            });

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
            const reg = await models.Venta_en_linea.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
            //Actualizar stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                aumentarStock(x._id, x.cantidad);
            });

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    modificarGuia: async (req, res, next) => {

        try {
            const reg = await models.Venta_en_linea.findByIdAndUpdate({ _id: req.body._id }, { numero_guia: req.body.numero_guia });


            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    grafico12Meses: async (req, res, next) => {
        try {
            //funcion para agregar caracteristicas
            const reg = await models.Venta_en_linea.aggregate(
                [
                    { //agrupacion
                        $group: {
                            _id: {
                                mes: { $month: "$createdAt" },
                                year: { $year: "$createdAt" }
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.year": -1, "_id.mes": -1
                        }
                    }
                ]
            ).limit(12);

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    //Crear compra en Stripe
    checkout: async (req, res, next) => {

        try {

            const carrito = await models.Carrito.findOne({ _id: req.query._id }).populate('usuario', { nombre: 1 });
            const token = req.body;
            const datosEnvio = {
                destinatario: token.card.name,
                calle: token.card.address_line1,
                ciudad: token.card.address_city,
                estado: token.card.address_state,
                codigo_postal: token.card.address_zip
            };

            const datosFacturacion = {
                destinatario: token.card.name,
                calle: token.card.address_line1,
                ciudad: token.card.address_city,
                estado: token.card.address_state,
                codigo_postal: token.card.address_zip
            };
            const comisionSinIva = (parseFloat(carrito.total) * 0.036) + 3;
            const comision = (comisionSinIva * 0.16) + comisionSinIva;
            const neto = parseFloat(carrito.total) - comision;


            const reg = await models.Venta_en_linea.create({
                usuario: carrito.usuario, importe: carrito.total, comision: comision, neto: neto,
                detalles: carrito.detalles, datosEnvio: datosEnvio, datosFacturacion: datosFacturacion
            });

            //Actualizar stock
            let detalles = carrito.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad);
            });

            //Creacion del customer en stripe
            const customer = await stripe.customers.create({
                email: token.email,
                source: token.id
            });

            let nombreProductos = carrito.detalles.map((elemento, i) => {
                return elemento.articulo;
            })

            //Creacion del cargo en stripe
            const charge = await stripe.charges.create(
                {
                    amount: carrito.total * 100,
                    currency: "mxn",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `compro ${nombreProductos}`,
                    shipping: {
                        name: token.card.name,
                        address: {
                            line1: token.card.address_line1,
                            line2: token.card.address_line2,
                            city: token.card.address_city,
                            country: token.card.address_country,
                            postal_code: token.card.address_zip
                        }
                    }
                }
            );

            //envio de correo de confirmacion del pago
            enviarConfrmacion(token.email, carrito.usuario);

            res.status(200).json(reg);


        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error, al hacer el pago en línea'
            });
            next(e);
        }

    },
    updateDatosEnvio: async (req, res, next) => {

        try {
            const addresses = req.body;

            const datosEnvio = {
                destinatario: addresses.shipping_name,
                calle: addresses.shipping_address_line1,
                ciudad: addresses.shipping_address_city,
                estado: addresses.shipping_address_state,
                codigo_postal: addresses.shipping_address_zip
            };
            const reg = await models.Venta_en_linea.findByIdAndUpdate({ _id: req.query._id }, { datosEnvio: datosEnvio });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error, al actualizar los datos de envio'
            });
            next(e);
        }

    },
    //Crear compra en Stripe
    checkoutProducto: async (req, res, next) => {

        try {

            const producto = await models.Articulo.findOne({ _id: req.query.producto }).populate('categoria', { nombre: 1 });
            const token = req.body;
            const datosEnvio = {
                destinatario: token.card.name,
                calle: token.card.address_line1,
                ciudad: token.card.address_city,
                estado: token.card.address_state,
                codigo_postal: token.card.address_zip


            };
            const detalles = {
                _id: producto._id,
                articulo: producto.nombre,
                cantidad: token.compra.cantidad,
                precio: producto.precio_venta
            }

            const datosFacturacion = {
                destinatario: token.card.name,
                calle: token.card.address_line1,
                ciudad: token.card.address_city,
                estado: token.card.address_state,
                codigo_postal: token.card.address_zip


            };
            const total = token.compra.cantidad * producto.precio_venta;
            const comisionSinIva = (parseFloat(total) * 0.036) + 3;
            const comision = (comisionSinIva * 0.16) + comisionSinIva;
            const neto = parseFloat(total) - comision;


            const reg = await models.Venta_en_linea.create({
                usuario: token.compra.usuario, importe: total, comision: comision, neto: neto,
                detalles: detalles, datosEnvio: datosEnvio, datosFacturacion: datosFacturacion
            });

            //Actualizar stock

            disminuirStock(detalles._id, detalles.cantidad);


            //Creacion del customer en stripe

            const customer = await stripe.customers.create({
                email: token.email,
                source: token.id
            });

            const charge = await stripe.charges.create(
                {
                    amount: total * 100,
                    currency: "mxn",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `compro ${producto.nombre}`,
                    shipping: {
                        name: token.card.name,
                        address: {
                            line1: token.card.address_line1,
                            line2: token.card.address_line2,
                            city: token.card.address_city,
                            country: token.card.address_country,
                            postal_code: token.card.address_zip
                        }
                    }
                }
            );

            //envio de correo de confirmacion del pago
            enviarConfrmacion(token.email, token.compra.usuario);

            res.status(200).json(reg);


        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    },
    //Envia el correo con el número de guía 
    correoSend: async (req, res, next) => {
        try {
            console.log("Entro al metodo para enviar el numero de guia ");
            const reg = await models.Venta_en_linea.findOne({ _id: req.body._id });
            const { nombre, email } = await models.Usuario.findOne({ _id: reg.usuario });
            let numGuia = reg.numero_guia;
            let mensaje = 'ggvgvgsx';


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
                subject: 'Número de guía invernadero El Secreto de la Montaña',
                html: `
                <!doctype html>
                <html>
                   <head>
                        <meta charset="utf-8">
                        <title>PDF Result Template</title>
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
                        <h1>Número de guía</h1>
                        <p>Hola ${nombre}, tu pedido esta en camino con el número de guía ${numGuia} </p>
                        <p>Gracias por tu compra</p>
                        <p>Invernadero "El Secreto de la Montaña"</p>
                    </body>
                </html>
            `
            }

            await transport.sendMail(info, (err, data) => {
                if (err) {
                    console.log(err);

                    return console.log('Ocurrio un error al enviar el correo electronico con el número de guía');
                }
                else{
                   
                    res.status(200).send({
                     message:'Correo enviado'
                      });
                      return console.log('Correo enviado!!!');
                   }

            });
            // Cambiar estado del envio
            estadoCorreo(reg._id);

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error al enviar el correo electronico con el número de guía'
            });
            next(error);
        }

    }

}