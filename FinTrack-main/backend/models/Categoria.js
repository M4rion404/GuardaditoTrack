const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  Titulo: { type: String, required: true },
  Descripcion: { type: String },
});

module.exports = CategoriaSchema;