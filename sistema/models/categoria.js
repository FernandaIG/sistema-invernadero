import mongoose, {Schema} from 'mongoose';
const categoriaSchema= new Schema({
    nombre:{type: String, maxlength:80, unique:true, required:true},
    descripcion:{type: String, maxlength:255, default:'SD'},
    estado:{type:Number, default:1},
    createdAt:{type: Date, default:Date.now}
});

const Categoria= mongoose.model('categoria', categoriaSchema);

export default Categoria;