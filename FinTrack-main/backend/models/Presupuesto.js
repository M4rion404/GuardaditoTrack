const mongoose = require('mongoose');

const PresupuestoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  
  meta_ahorro: { type: Number, required: true, min: 0 },
  monto_inicial: { type: Number, default: 0, min: 0 },

  dinero_ahorrado: { type: Number, default: 0, min: 0 },
  dinero_gastado: { type: Number, default: 0, min: 0 },
  
  categoria_asociada: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  divisa_asociada: { type: mongoose.Schema.Types.ObjectId, ref: 'Divisa' },
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = PresupuestoSchema;
