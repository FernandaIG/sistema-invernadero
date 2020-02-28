import mongoose, {Schema} from 'mongoose';
const salidaSchema= new Schema({
    cuenta: {type: Schema.ObjectId, ref:'cuenta'},
    cantidad:{type: Number, defaault:0},
    observacion:{type: String, maxlength:150, default:"SO"},
    estado:{type: Number, default:1},
    createdAt:{type: Date, default:Date.now}
});

const Salida=new mongoose.model('salida',salidaSchema);
export default Salida;