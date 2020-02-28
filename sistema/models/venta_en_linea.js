import mongoose, {Schema} from 'mongoose';
const ventaSchema = new Schema({
    usuario:{type: Schema.ObjectId, ref: 'usuario',required:true },
    descripcion:{type: String, default:'Venta de varios articulos'},
    importe:{type: Number},
    comision:{ type:Number},
    neto:{ type:Number},
    detalles: [{
        _id:{
            type:String,
            required:true
        },
        articulo:{
            type:String,
            required:true
        },
        cantidad:{
            type:Number,
            required:true
        },
        precio:{
            type:Number,
            required:true
        }
    }],
    datosEnvio:{
        destinatario:{
            type:String,
            required:true
        },
        calle:{
            type:String,
            required:true,
        },
        ciudad:{
            type:String,
            required:true,
        },
        estado:{
            type:String,
            required:true,
        },
        codigo_postal:{
            type:String,
            required:true,
        }
    },
    datosFacturacion:{
        destinatario:{
            type:String,
            required:true
        },
        calle:{
            type:String,
            required:true,
        },
        ciudad:{
            type:String,
            required:true,
        },
        estado:{
            type:String,
            required:true,
        },
        codigo_postal:{
            type:String,
            required:true,
        }        
    },
    paqueteria:{type:String, default:'DHL'},
    numero_guia:{type:String, default:'Pendiente'},
    estado: { type:String, default:'Pendiente'},
    createdAt: { type: Date, default: Date.now }
});

const VentaOnline=new mongoose.model('VentaOnline',ventaSchema);
export default VentaOnline;