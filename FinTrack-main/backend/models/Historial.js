const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  
  fecha: { type: Date, default: Date.now },
  tipo: { type: String, enum: ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'], required: true },
  accion: { type: String, required: true },
  datos_antes: { type: Object, default: {} },
  datos_despues: { type: Object, default: {} }

});

module.exports = historialSchema;