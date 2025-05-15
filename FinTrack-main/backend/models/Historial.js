const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['presupuesto', 'transaccion', 'categoria', 'movimiento'], required: true },
  accion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  datos_antes: { type: Object, default: {} },
  datos_despues: { type: Object, default: {} }
});

//module.exports = mongoose.model('Historial', historialSchema);
module.exports = historialSchema;