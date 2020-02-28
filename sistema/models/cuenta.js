import mongoose, {Schema} from 'mongoose';
const cuentaSchema= new Schema({
    codigo:{type: String, maxlength:64,unique:true, required:true},
    nombre:{type: String, maxlength:150, unique:true, required:true},
    entrada:{type: Number, default:0},
    salida:{type: Number,default:0},
    saldo:{type: Number,default:0},
    observacion:{type: String, maxlength:150,default:"SO"},
    estado:{type: Number, default:1},
    createdAt:{type: Date, default:Date.now}
});

const Cuenta=new mongoose.model('cuenta',cuentaSchema);
export default Cuenta;