import mongoose, { Schema } from 'mongoose';

const presupuestoSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'usuario', required: true },
    persona: { type: Schema.ObjectId, ref: 'persona', required: true },
    impuesto: { type: Number, required: true },
    total: { type: Number, required: true },
    descripcion:{type: String}
,    detalles: [{
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
    estado: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});
const Presupuesto = mongoose.model('presupuesto', presupuestoSchema);
export default Presupuesto;