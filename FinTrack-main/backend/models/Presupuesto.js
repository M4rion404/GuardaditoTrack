const mongoose = require('mongoose');

// Primero define el subesquema
const CategoriaInternaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  titulo: String,
  descripcion: String
}, { _id: false });

// Luego define el esquema principal
const PresupuestoSchema = new mongoose.Schema({

  titulo: { type: String, required: true },
  descripcion: { type: String },
  
  limite: { type: Number, required: true, min: 0 },
  dinero_disponible: { type: Number }, 
  periodo: { type: String, enum: ["Mensual", "Semanal", "Anual", "Quincenal"] },

  fecha_creacion: { type: Date, default: Date.now },

  categorias : [
    {
      categoria: { type: CategoriaInternaSchema, required: true },
      limite: { type: Number, required: true, min: 0 }
    }
  ]

});

// Middleware para inicializar dinero_disponible
PresupuestoSchema.pre('save', function (next) {
  if (this.dinero_disponible == null) {
    this.dinero_disponible = this.limite;
  }
  next();
});

module.exports = PresupuestoSchema;