import models from '../models/index';
export default {

    //Metodos de cada ruta

    add: async (req,res,next) =>{
        try {
            const reg = await models.Cuenta.create(req.body);
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }
    },

    query: async (req, res, next) =>{
        try {
            const reg= await models.Cuenta.findOne({_id:req.query._id});
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
            const reg= await models.Cuenta.find({$or:[{'nombre':new RegExp(valor,'i')}, {'observacion':new RegExp(valor,'i')} ]},{createdAt:0}).sort({'createdAt':-1});
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
            const reg = await models.Cuenta.findByIdAndUpdate({_id:req.body._id},{codigo:req.body.codigo,nombre:req.body.nombre,observacion:req.body.observacion});
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

            const reg= await models.Cuenta.findByIdAndDelete({_id:req.body._id});
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
            const reg= await models.Cuenta.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg= await models.Cuenta.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
            
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },

}