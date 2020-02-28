import models from '../models/index';
import { model } from 'mongoose';

async function aumentarCalificacion(idarticulo){

    let {calificacion}=await models.Articulo.findOne({_id:idarticulo});
    let nuevaCali=parseInt(calificacion) + 1;


    const reg2= await models.Articulo.findByIdAndUpdate({_id:idarticulo}, {calificacion:nuevaCali});

}

async function disminuirCalificacion(idarticulo){

    let {calificacion}=await models.Articulo.findOne({_id:idarticulo});
    let nuevaCali=parseInt(calificacion) - 1;


    const reg2= await models.Articulo.findByIdAndUpdate({_id:idarticulo}, {calificacion:nuevaCali});

}

export default {

    //Metodos de cada ruta

    add: async (req,res,next) =>{
        try {
            const reg = await models.Calificar.create(req.body);

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
            const reg= await models.Calificar.findOne({articulo:req.query.articulo})
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
            const reg= await models.Calificar.find({'createdAt':new RegExp(valor,'i')} )
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
    
    addComment: async (req, res, next) =>{

        try {
            const reg = await models.Calificar.findByIdAndUpdate({_id:req.query._id},
                {$push: {comentarios:{_id:req.body._id, nombre_usuario:req.body.usuario, texto:req.body.comentario}}},{new:true} );
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    addLike: async (req, res, next) =>{

        try {
            console.log(req.query._id);
            const reg = await models.Calificar.findByIdAndUpdate({_id:req.query._id},
                {$push: {likes:req.body._id}});
            
                let {articulo}=await models.Calificar.findOne({_id:req.query._id});
//Aumentar la calificacion al producto        
                aumentarCalificacion(articulo);

            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    //Eliminar elementos del arreglo "comentarios" con el metodo $pull

    deleteComment: async (req, res, next) =>{

        try {
            const reg = await models.Calificar.update({_id:req.query._id},
                {$pull: {comentarios:{texto:req.body.comentario}}} );
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    deleteLike: async (req, res, next) =>{

        try {
            const reg = await models.Calificar.update({_id:req.query._id},
                {$pull: {likes:req.body._id}});
            res.status(200).json(reg);

            //Disminuir calificacion al producto
            let {articulo}=await models.Calificar.findOne({_id:req.query._id});

                
            disminuirCalificacion(articulo);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    //Metodo para Actualizar un comentario
    updateComment: async (req, res, next) =>{

        try {
            
        const reg = await models.Carrito.findByIdAndUpdate({_id:req.query._id},{ comentarios:req.body.comentarios});

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
            const reg= await models.Calificar.findByIdAndUpdate({_id:req.body._id},{estado:1});
            //Actualizar stock
            let detalles=reg.detalles;
            detalles.map(function(x){
                disminuirStock(x._id, x.cantidad);
            });

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
            const reg= await models.Calificar.findByIdAndUpdate({_id:req.body._id},{estado:0});
            //Actualizar stock
            let detalles=reg.detalles;
            detalles.map(function(x){
                aumentarStock(x._id, x.cantidad);
            });
            
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },


}