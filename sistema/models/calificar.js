import mongoose, {Schema} from 'mongoose';

const CalificarSchema =new Schema({
    articulo: {type: Schema.ObjectId, ref:'articulo', unique:true},
    comentarios:[{
        _id: {
            type: String,
            requerid: true
        },
        nombre_usuario:{
            type: String,
            requerid: true
        },

        texto:{
            type: String,
            requerid: true
        },

        fecha: {
            type: Date, 
            default:Date.now
        }
    }],

    likes:[
       {
           type:String
       }
    ],
    createdAt:{type: Date, default:Date.now}


});
const Calificar = mongoose.model('calificar',CalificarSchema);

export default Calificar;