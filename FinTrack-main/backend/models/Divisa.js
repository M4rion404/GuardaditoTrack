const mongoose = require('mongoose');

const DivisaSchema = new mongoose.Schema({
  divisa: { type: String, required: true },
  nombre: { type: String, required: true },
});

module.exports = DivisaSchema; // embebido
