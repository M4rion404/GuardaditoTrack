const Gasto = require('../models/gastos');

// Controlador para agregar un nuevo gasto
exports.createGasto = async (req, res) => {
  const { descripcion, monto } = req.body;

  if (!descripcion || !monto) {
    return res.status(400).json({ error: 'Descripción y monto son requeridos' });
  }

  try {
    const nuevoGasto = new Gasto({ descripcion, monto });
    await nuevoGasto.save();
    res.status(201).json(nuevoGasto);
  } catch (err) {
    res.status(500).json({ error: 'Hubo un error al guardar el gasto' });
  }
};

// Controlador para obtener todos los gastos
exports.getGastos = async (req, res) => {
  try {
    const gastos = await Gasto.find();
    res.status(200).json(gastos);
  } catch (err) {
    res.status(500).json({ error: 'Hubo un error al obtener los gastos' });
  }
};
