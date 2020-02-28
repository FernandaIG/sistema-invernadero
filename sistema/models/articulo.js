import mongoose, {Schema} from 'mongoose';
const articuloSchema= new Schema({
    categoria: {type: Schema.ObjectId, ref:'categoria'},
    codigo:{type: String, maxlength:64, unique:true, required:true},
    nombre:{type: String, maxlength:50, unique:true, required:true},
    descripcion:{type: String, maxlength:255, default:"SD"},
    precio_venta:{type: Number, required:true},
    stock:{type: Number, required:true},
    estado:{type: Number,default:1},
    imagenes: {type: String, default:"SinImg"},
    calificacion:{type: Number, default:1},
    createdAt:{type: Date, default:Date.now}
});

const Articulo=new mongoose.model('articulo',articuloSchema);
export default Articulo;