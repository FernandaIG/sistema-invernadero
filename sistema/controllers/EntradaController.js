import models from '../models/index';

async function aumentarEntrada(idcuenta, cantidad){
    let {entrada,saldo}=await models.Cuenta.findOne({_id:idcuenta});
    let nEntrada=parseInt(entrada) + parseInt(cantidad);
    let nSaldo=parseInt(saldo) + parseInt(cantidad);
    const reg= await models.Cuenta.findByIdAndUpdate({_id:idcuenta},{entrada:nEntrada,saldo:nSaldo});
}

async function disminuirEntrada(idcuenta, cantidad){
    let {entrada,saldo}=await models.Cuenta.findOne({_id:idcuenta});
    let nEntrada=parseInt(entrada) - parseInt(cantidad);
    let nSaldo=parseInt(saldo) - parseInt(cantidad);
    const reg= await models.Cuenta.findByIdAndUpdate({_id:idcuenta},{entrada:nEntrada,saldo:nSaldo});
}

export default {

    //Metodos de cada ruta

    add: async (req,res,next) =>{
        try {
            const reg = await models.Entrada.create(req.body);

            //Actualizar Cuenta                    
            aumentarEntrada(reg.cuenta, reg.cantidad);         
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
            const reg= await models.Entrada.findOne({_id:req.query._id})
            .populate('cuenta',{nombre:1,codigo:1});
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
            const reg= await models.Entrada.find({$or:[{'nombre':new RegExp(valor,'i')}, {'observacion':new RegExp(valor,'i')} ]})
            .populate('cuenta',{nombre:1,codigo:1})
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
            const reg = await models.Entrada.findByIdAndUpdate({_id:req.body._id},{cuenta:req.body.cuenta,cantidad:req.body.cantidad,observacion:req.body.observacion});
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
            const reg= await models.Entrada.findByIdAndUpdate({_id:req.body._id},{estado:1});
            let valor=reg.cuenta;
            //Actualizar Cuenta 
                           
            aumentarEntrada(valor, reg.cantidad);         
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
            const reg= await models.Entrada.findByIdAndUpdate({_id:req.body._id},{estado:0});
            
            //Actualizar Cuenta 
            let valor=reg.cuenta;               
            disminuirEntrada(valor, reg.cantidad);             
            res.status(200).json(reg);
                        
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }

    },
/*
    grafico12Meses:async(req,res,next) =>{
        try {
            //funcion para agregar caracteristicas
             const reg=await models.Entrada.aggregate(
                [
                    { //agrupacion
                        $group:{
                            _id:{
                                mes:{$month:"$createdAt"},
                                year:{$year: "$createdAt"}
                            },
                            total:{$sum:"$total"},
                            numero:{$sum:1}
                        }
                    },
                    {
                        // ordenamiento
                        $sort:{
                            "_id.year":-1,"_id.mes":-1
                        }
                    }
                ]
            ).limit(12);
            
            res.status(200).json(reg);
        } catch(e){
                res.status(500).send({
                    message:'Ocurrió un error'
                });
                next(e);
         }
    }*/

}