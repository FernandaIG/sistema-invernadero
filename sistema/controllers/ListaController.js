import models from '../models/index';
import { model } from 'mongoose';

async function aumentarStock(idarticulo, cantidad){
    let {stock}=await models.Articulo.findOne({_id:idarticulo});
    let nStock=parseInt(stock) + parseInt(cantidad);
    const reg= await models.Articulo.findByIdAndUpdate({_id:idarticulo},{stock:nStock});
}

async function disminuirStock(idarticulo, cantidad){
    let {stock}=await models.Articulo.findOne({_id:idarticulo});
    let nStock=parseInt(stock) - parseInt(cantidad);
    const reg= await models.Articulo.findByIdAndUpdate({_id:idarticulo},{stock:nStock});
}


export default {

    //Metodos de cada ruta

    add: async (req,res,next) =>{
        try {
            const reg = await models.Lista.create(req.body);

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
            const reg= await models.Lista.findOne({usuario:req.query.usuario})
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
            const reg= await models.Lista.find({'createdAt':new RegExp(valor,'i')} )
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
            const reg = await models.Lista.findByIdAndUpdate({_id:req.query._id},
                {$push: {detalles:{_id:req.body._id, articulo:req.body.articulo, descripcion:req.body.descripcion,cantidad:req.body.cantidad, precio:req.body.precio}}},{new:true} );
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    updateDetalles: async (req, res, next) =>{

        try {
            const reg = await models.Lista.update({_id:req.query._id},
                {$pull: {detalles:{_id:req.body._id}}} );
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
            
        const reg = await models.Lista.findByIdAndUpdate({_id:req.query._id},{ detalles:req.body.detalles});

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    
    
    /*
    remove: async (req, res, next) =>{

        try {

            const reg= await models.Categoria.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    */
    activate: async (req, res, next) =>{

        try {
            const reg= await models.Lista.findByIdAndUpdate({_id:req.body._id},{estado:1});
           
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
            const reg= await models.Lista.findByIdAndUpdate({_id:req.body._id},{estado:0});
            
            
            res.status(200).json(reg);
            
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