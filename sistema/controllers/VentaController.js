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
    const reg = await models.Articulo.findByIdAndUpdate({ _id: idarticulo }, { stock: nStock });
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

    await models.Venta.findByIdAndUpdate({_id: id},{nombreUsuario: nombre});

    
}

export default {

    //Metodos de cada ruta

    add: async (req, res, next) => {
        try {
            const reg = await models.Venta.create(req.body);

            nombreUser(reg._id ,reg.usuario);

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
            const reg = await models.Venta.findOne({ _id: req.query._id })
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
                message: 'Ocurrio un error en el request query'
            });
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let valor = req.query.valor;//RegExp es similar a "Like" en sql la i es para que no le importe si son mayusculas o minusculas
            const reg = await models.Venta.find({ $or: [{ 'num_comprobante': new RegExp(valor, 'i') }, { 'serie_comprobante': new RegExp(valor, 'i') }] })
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
    activate: async (req, res, next) => {

        try {
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
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
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
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
    //Gráficas ventas totales
    grafico12Meses: async (req, res, next) => {
        try {
            //función para agregar características
            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
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
            ).limit(5);

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoPorMes: async (req, res, next) => {
        try {
            //función para agregar características
            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
                        $group: {
                            _id: {
                                mes: { $month: "$createdAt" }
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.mes": -1
                        }
                    }
                ]
            ).limit(12);

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoPorDia: async (req, res, next) => {
        try {
            //función para agregar características
            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
                        $group: {
                            _id: {
                                dia: { $dayOfMonth: "$createdAt" }
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.dia": -1
                        }
                    }
                ]
            ).limit(31);

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    //Gráficas para ticket promedio
    graficoTicket: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();

            console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
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
                        $project: {
                            div: { $divide: ["$total", numOfDocs] }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.year": -1, "_id.mes": -1
                        }
                    }
                ]
            ).limit(5);
            //función para agregar características
            console.log("ticket:", reg);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoTicketMes: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();

            // console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
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
                        $project: {
                            div: { $divide: ["$total", numOfDocs] }
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
            //función para agregar características
            console.log(reg);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoTicketDia: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();

            // console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
                        $group: {
                            _id: {
                                dia: { $dayOfMonth: "$createdAt" },
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            div: { $divide: ["$total", "$numero"] }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.dia": -1
                        }
                    }
                ]
            ).limit(31);
            //función para agregar características
            console.log(reg);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    //Gráficas producto mas vendido
    graficoProducto: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();
            // const re = await models.Venta.find();
            // console.log("re", re);
            console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    {
                        $unwind: "$detalles"
                    },
                    {   //agrupación
                        $group: {
                            _id: {
                                mes: { $month: "$createdAt" },
                                year: { $year: "$createdAt" },
                                articulo: "$detalles.articulo",
                            },
                            cantidad: { $sum: "$detalles.cantidad" },
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.year": -1, "_id.mes": -1
                        }
                    }
                ]
            ).limit(7);
            //función para agregar características
            console.log("detalles", reg);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoProductoMes: async (req, res, next) => {
        try {

            const reg = await models.Venta.aggregate(
                [
                    {
                        $unwind: "$detalles"
                    },
                    { //agrupación
                        $group: {
                            _id: {
                                mes: { $month: "$createdAt" },
                                articulo: "$detalles.articulo",
                            },

                            cantidad: { $sum: "$detalles.cantidad" },
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.mes": -1
                        }
                    }
                ]
            ).limit(7);
            //función para agregar características
            console.log(reg);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoProductoDia: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();

            console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    {
                        $unwind: "$detalles"
                    },
                    { //agrupación
                        $group: {
                            _id: {
                                dia: { $dayOfMonth: "$createdAt" },
                                articulo: "$detalles.articulo",
                            },
                            cantidad: { $sum: "$detalles.cantidad" },
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.dia": -1
                        }
                    }
                ]
            ).limit(7);
            //función para agregar características
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    //Gráficas mejor vendedor
    graficoMejorVendedor: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();
            console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
                        $group: {
                            _id: {
                                mes: { $month: "$createdAt" },
                                year: { $year: "$createdAt" },
                                user: "$usuario",
                                nombreUser: "$nombreUsuario"
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.year": -1,
                        }
                    }
                ]
            ).limit(12);
            //función para agregar características
            console.log("año vendedor", reg);
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoMejorVendedorMes: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();

            console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
                        $group: {
                            _id: {
                                mes: { $month: "$createdAt" },
                                year: { $year: "$createdAt" },
                                user: "$usuario",
                                nombreUser: "$nombreUsuario"
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.mes": -1
                        }
                    }
                ]
            ).limit(12);
            //función para agregar características
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    },
    graficoMejorVendedorDia: async (req, res, next) => {
        try {

            let numOfDocs = await models.Venta.estimatedDocumentCount();

            console.log(numOfDocs);

            const reg = await models.Venta.aggregate(
                [
                    { //agrupación
                        $group: {
                            _id: {
                                dia: { $dayOfMonth: "$createdAt" },
                                user: "$usuario",
                                nombreUser: "$nombreUsuario"
                            },
                            total: { $sum: "$total" },
                            numero: { $sum: 1 }
                        }
                    },
                    {
                        // ordenamiento
                        $sort: {
                            "_id.dia": -1
                        }
                    }
                ]
            ).limit(12);
            //función para agregar características
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error al generar la grafica'
            });
            next(e);
        }
    }


}