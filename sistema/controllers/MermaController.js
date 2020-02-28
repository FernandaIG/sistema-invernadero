import models from '../models/index';
import { model } from 'mongoose';

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
  }
}

async function nombreUser(id, idUser) {

    let { nombre } = await models.Usuario.findOne({ _id: idUser });

    await models.Merma.findByIdAndUpdate({_id: id},{nombreUsuario: nombre});

    
}

export default {

    //Metodos de cada ruta

    add: async (req, res, next) => {
        try {
            const reg = await models.Merma.create(req.body);

            //nombreUser(reg._id ,reg.usuario);

            //Actualizar stock
            let detalles = req.body.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad);
            });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error',
                estado: 500
            });
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await models.Merma.findOne({ _id: req.query._id })
                .populate('usuario', { nombre: 1 });
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
                message: 'Ocurrio un error en el request query'
            });
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let valor = req.query.valor;//RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas
            const reg = await models.Merma.find({ $or: [{ 'observaciones': new RegExp(valor, 'i') }] })
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
    activate: async (req, res, next) => {

        try {
            const reg = await models.Merma.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
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
            const reg = await models.Merma.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
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
    

}