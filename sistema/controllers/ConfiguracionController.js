import models from '../models/index';

export default {

    //Metodos de cada ruta
    add: async (req, res, next) => {
        try {
            const reg = await models.configuracion.create(req.body);
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
            const reg = await models.configuracion.findByIdAndUpdate({ _id: req.body._id }, { vision: req.body.vision, mision: req.body.mision, empresa: req.body.empresa, compromiso: req.body.compromiso });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al editar la misión y visión'
            });
            next(e);
        }

    },
    list: async (req, res, next) => {

        try {
            
            let valor = req.query.valor;//RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas
            const reg = await models.configuracion.find({ $or: [{ 'mision': new RegExp(valor, 'i') }, { 'vision': new RegExp(valor, 'i') }] })
                .populate('usuario', { nombre: 1 })
                .sort({ 'createdAt': -1 });
                console.log("list", reg)
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }


    }

}