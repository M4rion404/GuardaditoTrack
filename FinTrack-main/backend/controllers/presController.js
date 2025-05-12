const Presupuesto = require('../models/Presupuesto');
const Usuario = require('../models/Usuarios');

exports.crearPresupuesto = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const nuevoPresupuesto = req.body;

  try {
    const usuarioExiste = await Usuario.findById(idUsuario);
    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Insertar presupuesto en array
    usuarioExiste.Presupuestos.push(nuevoPresupuesto);
    await usuarioExiste.save();

    res.status(200).json({ mensaje: 'Presupuesto creado exitosamente', presupuesto: nuevoPresupuesto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear presupuesto', error: error.message });
  }
};

exports.obtenerPresupuestos = async (req, res) => {
  const idUsuario = req.params.idUsuario;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario.Presupuestos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener presupuestos', error: error.message });
  }
};

exports.obtenerPresupuestoPorId = async (req, res) => {
  
  const { idUsuario, idPresupuesto } = req.params;

  try {
    
    const usuario = await Usuario.findById(idUsuario); 
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const presupuesto = usuario.Presupuestos.id(idPresupuesto);

    if (!presupuesto) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    res.status(200).json(presupuesto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar presupuesto', error: error.message });
  }
};

exports.actualizarPresupuesto = async (req, res) => {
  const { idUsuario, idPresupuesto } = req.params;
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const index = usuario.Presupuestos.findIndex(p => p._id.toString() === idPresupuesto);

    if (index === -1) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    // Actualización condicional usando el operador nullish coalescing (??)
    usuario.Presupuestos[index].titulo = datosActualizados.titulo ?? usuario.Presupuestos[index].titulo;
    usuario.Presupuestos[index].descripcion = datosActualizados.descripcion ?? usuario.Presupuestos[index].descripcion;
    usuario.Presupuestos[index].monto_limite = datosActualizados.monto_limite ?? usuario.Presupuestos[index].monto_limite;
    usuario.Presupuestos[index].monto_gastado = datosActualizados.monto_gastado ?? usuario.Presupuestos[index].monto_gastado;
    usuario.Presupuestos[index].categoria_asociada = datosActualizados.categoria_asociada ?? usuario.Presupuestos[index].categoria_asociada;

    await usuario.save();

    res.status(200).json({ mensaje: 'Presupuesto actualizado correctamente', presupuesto: usuario.Presupuestos[index] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar presupuesto', error: error.message });
  }
};

exports.eliminarPresupuesto = async (req, res) => {
  const { idUsuario, idPresupuesto } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const presupuestosAntes = usuario.Presupuestos.length;
    usuario.Presupuestos = usuario.Presupuestos.filter(p => p._id.toString() !== idPresupuesto);

    if (usuario.Presupuestos.length === presupuestosAntes) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    await usuario.save();
    res.status(200).json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar presupuesto', error: error.message });
  }
};
