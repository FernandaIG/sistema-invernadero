import mongoose, { Schema } from 'mongoose';

const apartadoSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'usuario', required: true },
    persona: { type: Schema.ObjectId, ref: 'persona', required: true },
    impuesto: { type: Number, required: false },
    total: { type: Number, required: false },
    subTotal: { type: Number, default: 0, required: false },
    descripcion: { type: String, required: false },
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
        precio: {
            type: Number,
            required: true
        }
    }],
    abonos: [{
        abono: {
            type: Number,
            default: 0,
            required: false
        },
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    estado: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});
const Apartado = mongoose.model('apartado', apartadoSchema);
export default Apartado;