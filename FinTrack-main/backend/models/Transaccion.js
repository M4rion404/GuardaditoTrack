const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  id_transaccion: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  accion: { type: String, enum: ['Ingreso', 'Retiro'], required: true },
  metodo_pago: { type: String },
  monto: { type: Number, required: true },
  estado: { type: String, enum: ['En proceso', 'Completado', 'Cancelado'], default: 'En proceso' },
  fecha: { type: Date, default: Date.now },
});

module.exports = TransaccionSchema;
