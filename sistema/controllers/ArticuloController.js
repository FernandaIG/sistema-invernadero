import models from '../models/index';

import fs from 'fs';
import path from 'path';

const stripe = require('stripe')('sk_test_yrK0FsGNh0b1s9POHEtTBfmm00Vu7RTmaK');

export default {

    //Metodos de cada ruta

    add: async (req,res,next) =>{
        try {
            const reg = await models.Articulo.create(req.body);
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
            const reg= await models.Articulo.findOne({_id:req.query._id}).populate('categoria', {nombre:1});
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

    queryCodigo: async (req, res, next) =>{
        try {
            const reg= await models.Articulo.findOne({codigo:req.query.codigo}).populate('categoria', {nombre:1});
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
            let valor= req.query.valor;                     //RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas, el siguiente campo es para ocultar campos de la tabla en este caso el createdAt
            const reg= await models.Articulo.find({$or:[{'nombre':new RegExp(valor,'i')}, {'descripcion':new RegExp(valor,'i')}, {'categoria':valor}]},{createdAt:0})
            .populate('categoria', {nombre:1})
            .sort({'createdAt':-1});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
    
    listsinCategoria: async (req, res, next) =>{
        try {
            let valor= req.query.valor;                     //RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas, el siguiente campo es para ocultar campos de la tabla en este caso el createdAt
            const reg= await models.Articulo.find({$or:[{'nombre':new RegExp(valor,'i')}, {'descripcion':new RegExp(valor,'i')}]},{createdAt:0})
            .populate('categoria', {nombre:1})
            .sort({'createdAt':-1});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    listCategoria: async (req, res, next) =>{
        try {
            const reg= await models.Articulo.find({categoria:req.query.categoria}).populate('categoria', {nombre:1});
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


    listPorCalificacion: async (req, res, next) =>{
        try {
            let valor= req.query.valor;                     //RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas, el siguiente campo es para ocultar campos de la tabla en este caso el createdAt
            const reg= await models.Articulo.find({$or:[{'nombre':new RegExp(valor,'i')}, {'descripcion':new RegExp(valor,'i')} ]},{createdAt:0})
            .populate('categoria', {nombre:1})
            .sort({'calificacion':-1});
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
            const reg = await models.Articulo.findByIdAndUpdate({_id:req.body._id},{categoria:req.body.categoria,codigo:req.body.codigo,nombre:req.body.nombre,descripcion:req.body.descripcion,precio_venta:req.body.precio_venta});
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error',
                estado:500

            });
            next(e);
        }

    },
    remove: async (req, res, next) =>{

        try {

            const reg= await models.Articulo.findByIdAndDelete({_id:req.body._id});
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
            const reg= await models.Articulo.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg= await models.Articulo.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

  
//Subir Imagen
    upload: async (req, res, next) =>{

        try {
            if(req.file){
                const reg= await models.Articulo.findOneAndUpdate({codigo:req.query.codigo},{imagenes:req.file.filename});

            res.status(200).json(reg);
            console.log(req.file); 
            }
            else{
                res.status(500).send({
                    message:'Solo Imagenes'
                });
                next(e);
            }
           
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

    getImage: (req, res) => {
        var file = req.query.image;
        var path_file = './public/img/uploads/'+file;
        console.log(path_file);
        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },

}