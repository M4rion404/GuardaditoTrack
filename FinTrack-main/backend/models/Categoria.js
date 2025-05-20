const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
});

module.exports = CategoriaSchema;