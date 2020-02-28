import mongoose, { Schema } from 'mongoose';
const ventaSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'usuario', required: true },
    persona: { type: Schema.ObjectId, ref: 'persona', required: true },
    tipo_comprobante: { type: String, maxlength: 20, required: true, default: 'Apartado' },
    num_comprobante: { type: String, maxlength: 10, required: true, default: 'Apartado' },
    nombreUsuario:{type: String, required: false, unique: true },
    impuesto: { type: Number },
    total: { type: Number },
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
    estado: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});
const Venta = mongoose.model('venta', ventaSchema);
export default Venta;