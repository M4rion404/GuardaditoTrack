//Transaccion.js
const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  
  titulo: { type: String, required: true },
  descripcion: { type: String },
  accion: { type: String, enum: ['Ingreso', 'Retiro'], default: 'Retiro', required: true },
  metodo_pago: { type: String, enum: ['Efectivo', 'Tarjeta de crédito', 'Tarjeta de Debito', 'Pago Móvil', 'PayPal', 'Criptomonedas', 'Pago con código QR', 'Transferencia'], default: 'Efectivo', required: true },
  monto: { type: Number, required: true },
  estado: { type: String, enum: ['En proceso', 'Completado', 'Cancelado'], default: 'En proceso' },
  divisa_asociada: { type: mongoose.Schema.Types.ObjectId },
  presupuesto_asociado: { type: mongoose.Schema.Types.ObjectId },
  fecha: { type: Date, default: Date.now },
});

//Exportar el esquema
module.exports = TransaccionSchema;