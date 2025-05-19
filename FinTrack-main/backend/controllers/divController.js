const  Usuario  = require('../models/Usuarios'); // Asegúrate que este sea el path correcto

// Crear una divisa para un usuario
exports.crearDivisa = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    usuario.tipo_divisa.push(req.body); // Añade la divisa al array
    await usuario.save();

    res.status(201).json(usuario.tipo_divisa[usuario.tipo_divisa.length - 1]); // Última divisa agregada
  } catch (error) {
    res.status(400).json({ error: 'Error al crear divisa', detalles: error.message });
  }
};

// Obtener todas las divisas de un usuario
exports.obtenerDivisas = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(usuario.tipo_divisa);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener divisas', detalles: error.message });
  }
};

// Obtener una divisa específica del usuario
exports.obtenerDivisaPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const divisa = usuario.tipo_divisa.id(req.params.idDivisa);
    if (!divisa) return res.status(404).json({ error: 'Divisa no encontrada' });

    res.json(divisa);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener divisa', detalles: error.message });
  }
};

// Actualizar una divisa específica
exports.actualizarDivisa = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const divisa = usuario.tipo_divisa.id(req.params.idDivisa);
    if (!divisa) return res.status(404).json({ error: 'Divisa no encontrada' });

    Object.assign(divisa, req.body); // Actualiza solo los campos recibidos
    await usuario.save();

    res.json(divisa);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar divisa', detalles: error.message });
  }
};

// Eliminar una divisa específica
exports.eliminarDivisa = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const divisa = usuario.tipo_divisa.id(req.params.idDivisa);
    if (!divisa) return res.status(404).json({ error: 'Divisa no encontrada' });

    divisa.remove(); // Elimina la divisa
    await usuario.save();

    res.json({ mensaje: 'Divisa eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar divisa', detalles: error.message });
  }
};
