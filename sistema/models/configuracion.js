import mongoose, { Schema } from 'mongoose';
const configuracionSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'usuario' },
    vision: { type: String, maxlength: 400, required: false },
    mision: { type: String, maxlength: 400, required: false },
    empresa: { type: String, maxlength: 400, required: false },
    compromiso: { type: String, maxlength: 400, required: false },
    estado: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

const configuracion = new mongoose.model('configuracion', configuracionSchema);
export default configuracion;