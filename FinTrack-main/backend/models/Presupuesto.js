const mongoose = require('mongoose');

const PresupuestoSchema = new mongoose.Schema({
  id_presupuesto: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  monto_limite: { type: Number, required: true },
  monto_gastado: { type: Number, default: 0 },
  categoria_asociada: { type: mongoose.Schema.Types.ObjectId },
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = PresupuestoSchema;
