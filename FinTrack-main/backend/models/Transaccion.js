//Transaccion.js
const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  
  presupuesto_asociado: { type: mongoose.Schema.Types.ObjectId },
  categoria_asociada: { type: mongoose.Schema.Types.ObjectId },
  meta_asociada: { type: mongoose.Schema.Types.ObjectId },

  titulo: { type: String, required: true },
  descripcion: { type: String },
  
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },

  accion: { type: String, enum: ['Ingreso', 'Retiro'], default: 'Retiro', required: true },
  metodo_pago: { type: String, enum: ['Efectivo', 'Tarjeta'], default: 'Efectivo', required: true },

});

module.exports = TransaccionSchema;