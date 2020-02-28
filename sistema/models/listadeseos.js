import mongoose, {Schema} from 'mongoose';


const listaDeseoSchema= new Schema({
    usuario: {type: Schema.ObjectId, ref:'usuario', unique:true},
    detalles: [{
        _id: {
            type: String,
            required: true
        },
        articulo: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precio: {
            type: Number,
            required: true
        }
    }],
    estado:{type: Number, default:1},
    ceatedAt:{type:Date, default:Date.now}
});

const Lista= mongoose.model('lista', listaDeseoSchema);

export default Lista;