const mongoose = require('mongoose');

// Crear el esquema para el Gasto
const gastoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

// Crear el modelo de Gasto
const Gasto = mongoose.model('Gasto', gastoSchema);

module.exports = Gasto;
