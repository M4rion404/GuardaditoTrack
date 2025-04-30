const Categoria = require('../models/Categoria');

exports.crearCategoria = async (req, res) => {
  try {
    const nueva = new Categoria(req.body);
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear categoría', detalles: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías', detalles: error.message });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar categoría', detalles: error.message });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const actualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar categoría', detalles: error.message });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría', detalles: error.message });
  }
};
