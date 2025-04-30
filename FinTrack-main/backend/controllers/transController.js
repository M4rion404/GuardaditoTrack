const Transaccion = require('../models/Transaccion');

// Crear nueva transacción
exports.crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = new Transaccion(req.body);
    const transaccionGuardada = await nuevaTransaccion.save();
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear transacción', detalles: error.message });
  }
};

// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find().populate('categoria usuario');
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones', detalles: error.message });
  }
};

// Obtener una transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id).populate('categoria usuario');
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar transacción', detalles: error.message });
  }
};

// Actualizar una transacción
exports.actualizarTransaccion = async (req, res) => {
  try {
    const transaccionActualizada = await Transaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transaccionActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar transacción', detalles: error.message });
  }
};

// Eliminar una transacción
exports.eliminarTransaccion = async (req, res) => {
  try {
    await Transaccion.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Transacción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transacción', detalles: error.message });
  }
};
