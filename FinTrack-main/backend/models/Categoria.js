const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  Id_Categoria: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  Titulo: { type: String, required: true },
  Descripcion: { type: String },
});

// AQUI CREAMOS el modelo y lo exportamos
const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;
