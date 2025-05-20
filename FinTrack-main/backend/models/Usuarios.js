// Importaciones necesarias
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MetasAhorroSchema = require('./MetaAhorro'); 
const CategoriaSchema = require('./Categoria');
const PresupuestoSchema = require('./Presupuesto');
const TransaccionSchema = require('./Transaccion');
const HistorialSchema = require('./Historial');

const UsuarioSchema = new mongoose.Schema({
  
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  
  nombre_usuario: { type: String, required: true },
  numero_telefono: { type: String },
  
  verificacion: { type: String, enum: ["email", "sms", "configuracion_pendiente"], default: "email" },
  divisa: { type: String, default:"MXN" },

  presupuestos: [PresupuestoSchema],
  categorias: [CategoriaSchema],
  transacciones: [TransaccionSchema],
  metas_ahorro: [MetasAhorroSchema],
  historial: [HistorialSchema]
  
}, {versionKey: false});

// Encriptar contraseña
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema);