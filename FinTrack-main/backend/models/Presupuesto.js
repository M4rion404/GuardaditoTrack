const mongoose = require('mongoose');

const PresupuestoSchema = new mongoose.Schema({
  titulo: { type: String, require: true },
  descripcion: { type: String, require: true },
  
  meta_ahorro: { type: Number, require: true},
  monto_inicial: { type: Number, default: 0 },

  dinero_ahorrado: { type: Number, require: true },
  dinero_gastado: { type: Number, require: true },
  
  categoria_asociada: { type: mongoose.Schema.Types.ObjectId },
  divisa_asociada: { type: mongoose.Schema.Types.ObjectId },
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = PresupuestoSchema;
