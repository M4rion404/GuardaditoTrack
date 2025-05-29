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
  const { idUsuario, idMetaAhorro } = req.params;
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const index = usuario.metas_ahorro.findIndex(m => m._id.toString() === idMetaAhorro);
    if (index === -1) return res.status(404).json({ mensaje: 'Meta no encontrada' });

    const metaAntes = { ...usuario.metas_ahorro[index]._doc };

    // Validar y actualizar campos
    if (datosActualizados.nombre !== undefined)
      usuario.metas_ahorro[index].nombre = datosActualizados.nombre;

    if (datosActualizados.descripcion !== undefined)
      usuario.metas_ahorro[index].descripcion = datosActualizados.descripcion;

    if (datosActualizados.objetivo !== undefined)
      usuario.metas_ahorro[index].objetivo = datosActualizados.objetivo;

    if (datosActualizados.ahorrado !== undefined)
      usuario.metas_ahorro[index].ahorrado = datosActualizados.ahorrado;

    if (datosActualizados.fecha_limite !== undefined) {
      const nuevaFecha = new Date(datosActualizados.fecha_limite);
      if (isNaN(nuevaFecha)) {
        return res.status(400).json({ mensaje: 'Fecha límite inválida' });
      }
      usuario.metas_ahorro[index].fecha_limite = nuevaFecha;
    }

    if (datosActualizados.fecha !== undefined)
      usuario.metas_ahorro[index].fecha = datosActualizados.fecha;

    if (datosActualizados.estado !== undefined)
      usuario.metas_ahorro[index].estado = datosActualizados.estado;

    const metaDespues = usuario.metas_ahorro[index];
    const sinCambios = JSON.stringify(metaAntes) === JSON.stringify(metaDespues);
    if (sinCambios) {
      return res.status(200).json({ mensaje: 'No se realizaron cambios en la meta', meta: metaDespues });
    }

    // Registrar en historial
    usuario.historial = usuario.historial.filter(item =>
      item.tipo && ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'].includes(item.tipo)
    );

    usuario.historial.push({
      accion: 'actualizar',
      tipo: 'meta_ahorro',
      descripcion: `Actualizó la Meta "${metaDespues.nombre}"`,
      datos_antes: metaAntes,
      datos_despues: metaDespues,
      fecha: new Date()
    });

    usuario.historial = usuario.historial.sort((a, b) => b.fecha - a.fecha).slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: 'Meta actualizada correctamente',
      meta: metaDespues
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

    // 🧹 Eliminar transacciones relacionadas con esa meta
    const transAntes = usuario.transacciones.length;
    usuario.transacciones = usuario.transacciones.filter(
      t => t.meta_asociada?.toString() !== idMetaAhorro
    );
    const transEliminadas = transAntes - usuario.transacciones.length;

    // Registrar en historial
    usuario.historial = usuario.historial.filter(item =>
      item.tipo && ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'].includes(item.tipo)
    );

    usuario.historial.push({
      accion: 'Eliminación de Meta de Ahorro',
      tipo: 'meta_ahorro',
      descripcion: `Se eliminó la meta "${metaEliminada.nombre}" con ${transEliminadas} transacciones asociadas.`,
      datos_antes: metaEliminada,
      datos_despues: {},
      fecha: new Date()
    });

    usuario.historial = usuario.historial
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: `Meta de ahorro y ${transEliminadas} transacciones asociadas eliminadas correctamente.`,
      meta_eliminada: metaEliminada
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar Meta',
      error: error.message
    });
  }
};// ELIMINAR meta