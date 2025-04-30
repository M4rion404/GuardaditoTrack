const Movimiento = require('../models/Movimiento');

exports.crearMovimiento = async (req, res) => {
  try {
    const nuevo = new Movimiento(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear movimiento', detalles: error.message });
  }
};

exports.obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find().populate('usuario');
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener movimientos', detalles: error.message });
  }
};

exports.obtenerMovimientoPorId = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id).populate('usuario');
    if (!movimiento) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar movimiento', detalles: error.message });
  }
};

exports.actualizarMovimiento = async (req, res) => {
  try {
    const actualizado = await Movimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar movimiento', detalles: error.message });
  }
};

exports.eliminarMovimiento = async (req, res) => {
  try {
    await Movimiento.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Movimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar movimiento', detalles: error.message });
  }
};
