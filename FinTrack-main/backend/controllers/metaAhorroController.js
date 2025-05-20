const Meta = require('../models/MetaAhorro');
const Usuario = require('../models/Usuarios');

exports.crearMeta = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const datos = req.body;

  try {
    const usuarioExiste = await Usuario.findById(idUsuario);
    if (!usuarioExiste)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // Validar y convertir fecha_limite
    const fechaConvertida = new Date(datos.fecha_limite);
    if (isNaN(fechaConvertida)) {
      return res.status(400).json({ mensaje: "Fecha límite inválida" });
    }

    const nuevaMeta = {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo: datos.objetivo,
      fecha_limite: fechaConvertida,
      estado: datos.estado ?? 'Ahorrando'
    };

    usuarioExiste.metas_ahorro.push(nuevaMeta);
    await usuarioExiste.save();

    // Registrar acción en historial
    await Usuario.findByIdAndUpdate(idUsuario, {
      $push: {
        historial: {
          $each: [{
            accion: 'crear',
            tipo: 'meta_ahorro', 
            descripcion: `Creó la Meta "${nuevaMeta.nombre}"`,
            fecha: new Date(),
            detalles: nuevaMeta
          }],
          $sort: { fecha: -1 },
          $slice: 150
        }
      }

    });

    res.status(200).json({ mensaje: 'Meta creada exitosamente', meta: nuevaMeta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear Meta', error: error.message });
  }
}; // CREAR META

exports.obtenerMetas = async (req, res) => {
  const idUsuario = req.params.idUsuario;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario.metas_ahorro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener metas', error: error.message });
  }
}; // OBTENER metas

exports.obtenerMetaPorId = async (req, res) => {
  const { idUsuario, idMetaAhorro } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const meta = usuario.metas_ahorro.find(m => m._id.toString() === idMetaAhorro);

    if (!meta) {
      return res.status(404).json({ mensaje: 'Meta no encontrada' });
    }

    res.status(200).json(meta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar Meta', error: error.message });
  }
};// OBTENER Meta

exports.actualizarMeta = async (req, res) => {
  const { idUsuario, idMetaAhorro } = req.params; // Corregido aquí
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const index = usuario.metas_ahorro.findIndex(m => m._id.toString() === idMetaAhorro); // Cambiado idMeta por idMetaAhorro

    if (index === -1) {
      return res.status(404).json({ mensaje: 'Meta no encontrada' });
    }

    const metaAntes = { ...usuario.metas_ahorro[index]._doc };

    // Aplicar actualizaciones
    usuario.metas_ahorro[index].nombre = datosActualizados.nombre ?? usuario.metas_ahorro[index].nombre;
    usuario.metas_ahorro[index].descripcion = datosActualizados.descripcion ?? usuario.metas_ahorro[index].descripcion;
    usuario.metas_ahorro[index].objetivo = datosActualizados.objetivo ?? usuario.metas_ahorro[index].objetivo;
    usuario.metas_ahorro[index].fecha_limite = datosActualizados.fecha_limite ?? usuario.metas_ahorro[index].fecha_limite;
    usuario.metas_ahorro[index].estado = datosActualizados.estado ?? usuario.metas_ahorro[index].estado;

    // Agregar historial
    usuario.historial = usuario.historial.filter(item =>
      item.tipo && ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'].includes(item.tipo)
    );

    usuario.historial.push({
      accion: 'actualizar',
      tipo: 'meta_ahorro',
      descripcion: `Actualizó la Meta "${usuario.metas_ahorro[index].nombre}"`,
      datos_antes: metaAntes,
      datos_despues: usuario.metas_ahorro[index],
      fecha: new Date()
    });

    usuario.historial = usuario.historial.sort((a, b) => b.fecha - a.fecha).slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: 'Meta actualizada correctamente',
      meta: usuario.metas_ahorro[index]
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar Meta',
      error: error.message
    });
  }
};

exports.eliminarMeta = async (req, res) => {
  const { idUsuario, idMetaAhorro } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const metaEliminada = usuario.metas_ahorro.find(m => m._id.toString() === idMetaAhorro);
    if (!metaEliminada) {
      return res.status(404).json({ mensaje: 'Meta no encontrada' });
    }

    usuario.metas_ahorro = usuario.metas_ahorro.filter(m => m._id.toString() !== idMetaAhorro);

    // Registrar en historial
    usuario.historial = usuario.historial.filter(item =>
      item.tipo && ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'].includes(item.tipo)
    );

    usuario.historial.push({
      accion: 'eliminar',
      tipo: 'meta_ahorro',
      descripcion: `Eliminó la Meta "${metaEliminada.nombre}"`,
      datos_antes: metaEliminada,
      datos_despues: {},
      fecha: new Date()
    });

    usuario.historial = usuario.historial.sort((a, b) => b.fecha - a.fecha).slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: 'Meta eliminada correctamente',
      meta_eliminada: metaEliminada
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar Meta',
      error: error.message
    });
  }
};// ELIMINAR meta