import models from '../models/index';
import { model } from 'mongoose';

async function disminuirStock(idarticulo, cantidad) {
    console.log('Entro a disminuir')
    let { stock } = await models.Articulo.findOne({ _id: idarticulo });
    let nStock = parseInt(stock) - parseInt(cantidad);
    const reg = await models.Articulo.findByIdAndUpdate({ _id: idarticulo }, { stock: nStock });
}
async function aumentarStock(idarticulo, cantidad) {
    let { stock } = await models.Articulo.findOne({ _id: idarticulo });
    let nStock = parseInt(stock) + parseInt(cantidad);
    const reg = await models.Articulo.findByIdAndUpdate({ _id: idarticulo }, { stock: nStock });
}

async function sumaAbonos(idApartado, total) {

    const reg = await models.Apartado.findByIdAndUpdate({ _id: idApartado }, { subTotal: total });
}

async function actualizarAbono(idApartado, abono) {
    let { persona, usuario, total, impuesto, detalles } = await models.Apartado.findOne({ _id: idApartado });

    let subt = parseFloat(total) - parseFloat(abono);

    const reg0 = await models.Apartado.findByIdAndUpdate({ _id: idApartado }, { total: subt });

    if (subt == 0) {
        const reg1 = await models.Apartado.findByIdAndUpdate({ _id: idApartado }, { estado: 0 });
        let venta = new models.Venta({ usuario: usuario, persona: persona, impuesto: impuesto, total: total, detalles: detalles });
        venta.save();
    }
    console.log('Editado');
}

async function actualizarDes(idApartado, des){
const reg1 = await models.Apartado.findByIdAndUpdate({ _id: idApartado },{descripcion:des});
}

export default {

    //Metodos de cada ruta

    add: async (req, res, next) => {
        try {
            console.log(req.body);
            //variable para asignar el request y crear el apartado
            const reg = await models.Apartado.create(req.body);

            //Agregar el abono
            // agregarAbono(reg._id, reg.abonos);
            //Actualizar abono
            //Solo agrega un solo abono
            sumaAbonos(reg._id, reg.total);


            //Actualizar stock
            let detalles = req.body.detalles;
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

    query: async (req, res, next) => {
        try {
            const reg = await models.Apartado.findOne({ _id: req.query._id })
                .populate('cuenta', { nombre: 1, codigo: 1 });
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
            const reg = await models.Apartado.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'descripcion': new RegExp(valor, 'i') }] })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 })
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
            const reg = await models.Apartado.findByIdAndUpdate({ _id: req.body._id },
                { $push: { abonos: { abono: req.body.abonos } } },
                { new: true });

            //Actualizar el nuevo abono y restarlo al subtotal
            let abonos = req.body.abonos;
            console.log('abono ', req.body.abonos);
            actualizarAbono(reg._id, req.body.abonos);

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
            const reg = await models.Apartado.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);

            // Actualizar stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                aumentarStock(x._id, x.cantidad);
            });

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    activate: async (req, res, next) => {

        try {
            const reg = await models.Apartado.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
            let valor = reg.cuenta;

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
            const reg = await models.Apartado.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });

            //Actualizar stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                aumentarStock(x._id, x.cantidad);
            });

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }

    }
}