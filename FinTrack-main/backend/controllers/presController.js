const Presupuesto = require('../models/Presupuesto');

// Crear
exports.crearPresupuesto = async (req, res) => {
  try {
    const nuevoPresupuesto = new Presupuesto(req.body);
    const guardado = await nuevoPresupuesto.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear presupuesto', detalles: error.message });
  }
};

// Obtener todos
exports.obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().populate('usuario categoria');
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos', detalles: error.message });
  }
};

// Obtener por ID
exports.obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id).populate('usuario categoria');
    if (!presupuesto) return res.status(404).json({ error: 'Presupuesto no encontrado' });
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar presupuesto', detalles: error.message });
  }
};

// Actualizar
exports.actualizarPresupuesto = async (req, res) => {
  try {
    const actualizado = await Presupuesto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar presupuesto', detalles: error.message });
  }
};

// Eliminar
exports.eliminarPresupuesto = async (req, res) => {
  try {
    await Presupuesto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto', detalles: error.message });
  }
};
