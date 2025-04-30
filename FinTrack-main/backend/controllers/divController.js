const Divisa = require('../models/Divisa');

exports.crearDivisa = async (req, res) => {
  try {
    const nueva = new Divisa(req.body);
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear divisa', detalles: error.message });
  }
};

exports.obtenerDivisas = async (req, res) => {
  try {
    const divisas = await Divisa.find();
    res.json(divisas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener divisas', detalles: error.message });
  }
};

exports.obtenerDivisaPorId = async (req, res) => {
  try {
    const divisa = await Divisa.findById(req.params.id);
    if (!divisa) return res.status(404).json({ error: 'Divisa no encontrada' });
    res.json(divisa);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar divisa', detalles: error.message });
  }
};

exports.actualizarDivisa = async (req, res) => {
  try {
    const actualizada = await Divisa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar divisa', detalles: error.message });
  }
};

exports.eliminarDivisa = async (req, res) => {
  try {
    await Divisa.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Divisa eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar divisa', detalles: error.message });
  }
};
