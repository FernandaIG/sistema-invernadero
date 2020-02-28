import mongoose, {Schema} from 'mongoose';
const entradaSchema= new Schema({
    cuenta: {type: Schema.ObjectId, ref:'cuenta'},
    cantidad:{type: Number, default:0},
    observacion:{type: String, maxlength:150, default:"SO"},
    estado:{type: Number, default:1},
    createdAt:{type: Date, default:Date.now}
});

const Entrada=new mongoose.model('entrada',entradaSchema);
export default Entrada;