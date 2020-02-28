import mongoose, {Schema} from 'mongoose';
const personaSchema= new Schema({
    tipo_persona:{type: String, maxlength:30, required:true},
    nombre:{type: String, maxlength:60, unique:true,required:true},
    email:{type:String, maxlength:50, unique:true},
    telefono:{type: String,maxlength:30},
    direccion:{type: String,maxlength:100,required:true},
    listaNegra: { type: Number, default: 0 },
    estado:{type: Number, default:1},
    ceatedAt:{type:Date, default:Date.now}
});

const Persona= mongoose.model('persona', personaSchema);

export default Persona;