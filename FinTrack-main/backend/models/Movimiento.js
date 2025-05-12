const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  motivo: { type: String },
  metodo_pago: { type: String },
  accion: { type: String, enum: ['Ingreso', 'Retiro'] },
  monto_original: { type: Number },
  monto_actualizado: { type: Number },
  fecha: { type: Date, default: Date.now },
});

module.exports = MovimientoSchema;
