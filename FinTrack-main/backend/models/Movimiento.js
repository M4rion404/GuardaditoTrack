const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  id_movimiento: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  motivo: { type: String },
  metodo_pago: { type: String },
  accion: { type: String, enum: ['Ingreso', 'Retiro'] },
  monto_original: { type: Number },
  monto_actualizado: { type: Number },
  fecha: { type: Date, default: Date.now },
});

module.exports = MovimientoSchema;
