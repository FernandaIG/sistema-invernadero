import mongoose, {Schema} from 'mongoose';
const usuarioSchema= new Schema({
    rol:{type: String, maxlength:30, required:true},
    nombre:{type: String, maxlength:60, unique:true,required:true},
    usuario:{type: String, maxlength:60, unique:true,required:true},
    email:{type:String, maxlength:50, unique:true, required:true},
    telefono:{type: String,maxlength:30},
    direccion:{type: String,maxlength:100,required:true},
    password:{type: String, maxlength:64, required:true},
    estado:{type: Number, default:1},
    ceatedAt:{type:Date, default:Date.now}
});

const Usuario= mongoose.model('usuario', usuarioSchema);

export default Usuario;