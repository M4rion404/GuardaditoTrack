const mongoose = require('mongoose');

const DivisaSchema = new mongoose.Schema({
  divisa: { type: String, required: true },
  nombre: { type: String, required: true },
});

const Divisa = mongoose.model('Divisa', DivisaSchema);

module.exports = { Divisa, DivisaSchema };
