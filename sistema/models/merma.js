import mongoose, { Schema } from 'mongoose';
const mermaSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'usuario', required: true },
    detalles: [{
        _id: {
            type: String,
            required: true
        },
        articulo: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
       
    }],
    observaciones:{type: String, default:'Ninguna'},
    estado: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});
const Merma = mongoose.model('merma', mermaSchema);
export default Merma;