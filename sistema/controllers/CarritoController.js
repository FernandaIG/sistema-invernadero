import models from '../models/index';
import { model } from 'mongoose';
import nodemailer from 'nodemailer';


//Función 
async function enviarConfrmacion(usuario) {



    

    let { nombre } = await models.Usuario.findOne({ _id: usuario });
    let { email } = await models.Usuario.findOne({ _id: usuario });
console.log("correo de recordatorio de carrito de compras", email);
    let transport = await nodemailer.createTransport({//Variable que almacena las credenciales del servicio de correo electronico, el correo a utilizar y las contrseñas
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            //?
            rejectUnauthorized: false
        }
    });

    let info = {
        from: "'Invernadero El Secreto de la Montaña' <invernaderosm.20@gmail.com>",
        to: email,
        subject: 'Carrito de compras',
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
                <h1>Carrito de compras</h1>
                <p>Hola ${nombre} Regresa a echarle un vistazo a tu carrito de compras, tienes productos esperando por ti.</p>
                <p></p>
                <p>Invernadero "El Secreto de la Montaña"</p>
            </body>
        </html>
    `
    }

    transport.sendMail(info, (err, data) => {
        if (err) {
            console.log(err);

            return console.log('Ocurrio un error al enviar el correo electronico');
        }
        return console.log('Correo enviado!!!');
    });
}



export default {

    //Metodos de cada ruta

    add: async (req,res,next) =>{
        try {
            const reg = await models.Carrito.create(req.body);

            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error',
                estado:500
            });
            next(e);
        }
    },

    query: async (req, res, next) =>{
        try {
            const reg= await models.Carrito.findOne({usuario:req.query.usuario})
            .populate('usuario',{nombre:1});            
            if (!reg) {
                res.status(404).send({
                    message: 'El registro no existe'
                });
            }
            else{
                res.status(200).json(reg);
            }
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }
    },

    list: async (req, res, next) =>{
        try {
            let valor= req.query.valor;                     //RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas
            const reg= await models.Carrito.find({'createdAt':new RegExp(valor,'i')} )
            .populate('usuario',{nombre:1})
            .sort({'createdAt':-1});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    
    update: async (req, res, next) =>{

        try {
            const reg = await models.Carrito.findByIdAndUpdate({_id:req.query._id},
                {$push: {detalles:{_id:req.body._id, articulo:req.body.articulo, descripcion:req.body.descripcion,cantidad:req.body.cantidad, precio:req.body.precio}}},{new:true} );
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    //Eliminar elementos del arreglo "detalles" con el metodo $pull

    updateDetalles: async (req, res, next) =>{

        try {
            const reg = await models.Carrito.update({_id:req.query._id},
                {$pull: {detalles:{_id:req.body._id}}} );
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    updateTotal: async (req, res, next) =>{

        try {
            
        const reg = await models.Carrito.findByIdAndUpdate({_id:req.query._id},{total:req.body.total});

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    updateCantidad: async (req, res, next) =>{

        try {
            
        const reg = await models.Carrito.findByIdAndUpdate({_id:req.query._id},{ detalles:req.body.detalles});

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    
    
    
    remove: async (req, res, next) =>{

        try {

            const reg= await models.Carrito.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    
    activate: async (req, res, next) =>{

        try {
            const reg= await models.Carrito.findByIdAndUpdate({_id:req.body._id},{estado:1});
            

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    deactivate: async (req, res, next) =>{

        try {
            const reg= await models.Carrito.findByIdAndUpdate({_id:req.body._id},{estado:0});
           
            
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    recordatorio: async (req, res, next) =>{
        try {
            const reg= await models.Carrito.find()
            .populate('usuario',{nombre:1})
            .sort({'createdAt':-1});
            reg.map((valor,i)=>{
                    
                enviarConfrmacion(valor.usuario);
            });
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    // grafico12Meses:async(req,res,next) =>{
    //     try {
    //         //funcion para agregar caracteristicas
    //          const reg=await models.Venta.aggregate(
    //             [
    //                 { //agrupacion
    //                     $group:{
    //                         _id:{
    //                             mes:{$month:"$createdAt"},
    //                             year:{$year: "$createdAt"}
    //                         },
    //                         total:{$sum:"$total"},
    //                         numero:{$sum:1}
    //                     }
    //                 },
    //                 {
    //                     // ordenamiento
    //                     $sort:{
    //                         "_id.year":-1,"_id.mes":-1
    //                     }
    //                 }
    //             ]
    //         ).limit(12);
            
    //         res.status(200).json(reg);
    //     } catch(e){
    //             res.status(500).send({
    //                 message:'Ocurrió un error'
    //             });
    //             next(e);
    //      }
    // }

}