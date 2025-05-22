//transController.js
const mongoose = require("mongoose");
const Usuario = require("../models/Usuarios");
const Transaccion = require("../models/Transaccion");

exports.crearTransaccion = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const nuevaTransaccion = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);

    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // Buscar presupuesto afectado
    const presupuesto = usuario.presupuestos.find(
      (p) => p._id.toString() === nuevaTransaccion.presupuesto_asociado
    );

    if (!presupuesto)
      return res.status(404).json({ mensaje: "Presupuesto no encontrado" });

    // Buscar categoría afectada dentro del presupuesto
    const categoriaPresupuesto = presupuesto.categorias.find(
      (c) => c.categoria._id.toString() === nuevaTransaccion.categoria_asociada
    );

    if (!categoriaPresupuesto)
      return res.status(404).json({ mensaje: "Categoría no encontrada en presupuesto" });

    // Actualizar dinero disponible en presupuesto y categoría según acción
    if (nuevaTransaccion.accion.toLowerCase() === "retiro") {
      presupuesto.dinero_disponible -= nuevaTransaccion.monto;
      categoriaPresupuesto.dinero_disponible -= nuevaTransaccion.monto;
    } else if (nuevaTransaccion.accion.toLowerCase() === "ingreso") {
      presupuesto.dinero_disponible += nuevaTransaccion.monto;
      categoriaPresupuesto.dinero_disponible += nuevaTransaccion.monto;
    } else {
      return res.status(400).json({ mensaje: "Acción inválida" });
    }

    // Validar que dinero disponible no sea negativo (opcional)
    if (presupuesto.dinero_disponible < 0 || categoriaPresupuesto.dinero_disponible < 0) {
      return res.status(400).json({ mensaje: "Fondos insuficientes para esta transacción" });
    }

    // Agregar la transacción
    usuario.transacciones.push(nuevaTransaccion);

    // Agregar al historial
    usuario.historial.push({
      accion: "Creación de Transacción",
      tipo: "transaccion",
      descripcion: `${nuevaTransaccion.accion === "Retiro" ? "Retiró" : "Ingresó"}`,
      detalles: nuevaTransaccion,
      fecha: new Date(),
    });

    // Mantener historial limpio
    usuario.historial = usuario.historial
      .filter(
        (item) => item.fecha >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      )
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    // Guardar cambios
    await usuario.save();

    res.status(200).json({
      mensaje: "La transacción se ha realizado con éxito, presupuesto actualizado",
      transaccion: nuevaTransaccion,
      presupuestoActualizado: presupuesto,
    });
  } catch (error) {
    console.log("Error 500 en crear: ", error);
    res.status(500).json({ mensaje: "Error al crear transacción", error: error.message });
  }
};


exports.obtenerTransacciones = async (req, res) => {
  const idUsuario = req.params.idUsuario;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      console.log("Error 404: usuario no encontrado")
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    console.log("Transacciones obetnidas", usuario.transacciones);
    res.status(200).json(usuario.transacciones);
  } catch (error) {
    console.log("Error 500 en obtener transacciones", error);
    res
      .status(500)
      .json({
        mensaje: "Error al obtener transacciones",
        error: error.message,
      });
  }
};

exports.obtenerTransaccionPorId = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    console.log(usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const transaccion = usuario.Transacciones.id(idTransaccion);
    if (!transaccion) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }
    console.log("Transaccion obtenida", transaccion);
    res.status(200).json(transaccion);
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al obtener la transacción",
        error: error.message,
      });
  }
};
exports.actualizarTransaccion = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;
  const nuevosDatos = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const index = usuario.transacciones.findIndex(
      (t) => t._id.toString() === idTransaccion
    );

    if (index === -1) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    const transAnterior = usuario.transacciones[index];

    // Buscar presupuesto y categoría anteriores
    const presAnt = usuario.presupuestos.id(transAnterior.presupuesto_asociado);
    if (!presAnt) {
      return res.status(404).json({ mensaje: "Presupuesto anterior no encontrado" });
    }

    const catAnt = presAnt.categorias.find(c =>
      c.categoria && c.categoria._id.toString() === transAnterior.categoria_asociada.toString()
    );

    if (!catAnt) {
      return res.status(404).json({ mensaje: "Categoría anterior no encontrada" });
    }

    // Revertir efecto anterior
    if (transAnterior.accion === "Ingreso") {
      presAnt.dinero_disponible -= transAnterior.monto;
      catAnt.dinero_disponible -= transAnterior.monto;
    } else if (transAnterior.accion === "Retiro") {
      presAnt.dinero_disponible += transAnterior.monto;
      catAnt.dinero_disponible += transAnterior.monto;
    } else {
      return res.status(400).json({ mensaje: "Acción anterior inválida" });
    }

    // Obtener nuevos datos (o valores actuales)
    const nuevaAccion = nuevosDatos.accion ?? transAnterior.accion;
    const nuevoMonto = nuevosDatos.monto ?? transAnterior.monto;
    const nuevoPresId = nuevosDatos.presupuesto_asociado ?? transAnterior.presupuesto_asociado.toString();
    const nuevaCatId = nuevosDatos.categoria_asociada ?? transAnterior.categoria_asociada.toString();

    // Buscar nuevo presupuesto y categoría
    const presNuevo = usuario.presupuestos.id(nuevoPresId);
    if (!presNuevo) {
      return res.status(404).json({ mensaje: "Nuevo presupuesto no encontrado" });
    }

    const catNueva = presNuevo.categorias.find(c =>
      c.categoria && c.categoria._id.toString() === nuevaCatId
    );

    if (!catNueva) {
      return res.status(404).json({ mensaje: "Nueva categoría no encontrada" });
    }

    // Aplicar nuevo efecto: validando saldo no negativo
    if (nuevaAccion === "Ingreso") {
      presNuevo.dinero_disponible += nuevoMonto;
      catNueva.dinero_disponible += nuevoMonto;
    } else if (nuevaAccion === "Retiro") {
      if (presNuevo.dinero_disponible - nuevoMonto < 0 || catNueva.dinero_disponible - nuevoMonto < 0) {
        return res.status(400).json({
          mensaje: "No se puede actualizar la transacción porque resultaría en saldo negativo"
        });
      }
      presNuevo.dinero_disponible -= nuevoMonto;
      catNueva.dinero_disponible -= nuevoMonto;
    } else {
      return res.status(400).json({ mensaje: "Nueva acción inválida" });
    }

    const datosAntes = { ...transAnterior.toObject() };

    // Actualizar transacción
    transAnterior.titulo = nuevosDatos.titulo ?? transAnterior.titulo;
    transAnterior.descripcion = nuevosDatos.descripcion ?? transAnterior.descripcion;
    transAnterior.accion = nuevaAccion;
    transAnterior.metodo_pago = nuevosDatos.metodo_pago ?? transAnterior.metodo_pago;
    transAnterior.monto = nuevoMonto;
    transAnterior.categoria_asociada = nuevaCatId;
    transAnterior.presupuesto_asociado = nuevoPresId;

    await usuario.save();

    // Actualizar historial
    usuario.historial.push({
      accion: "Actualización de Transacción",
      tipo: "transaccion",
      datos_antes: datosAntes,
      datos_despues: transAnterior,
      fecha: new Date(),
    });

    // Opcional: mantener solo historial reciente
    usuario.historial = usuario.historial
      .filter(item => item.fecha >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: "Transacción actualizada correctamente",
      transaccion: transAnterior,
      presupuestoActualizado: presNuevo,
    });
  } catch (error) {
    console.error("Error al actualizar la transacción:", error);
    res.status(500).json({
      mensaje: "Error al actualizar la transacción",
      error: error.message,
    });
  }
};

exports.eliminarTransaccion = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const idTransaccion = req.params.idTransaccion;

  try {
    // Buscar usuario completo
    const usuario = await Usuario.findById(idUsuario);
    console.log("ID de usuario obtenido: ", idUsuario);
    console.log("Todo lo que retorna const 'usuario': ", usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Buscar la transacción dentro del arreglo embebido usuario.transacciones
    const transaccion = usuario.transacciones.id(idTransaccion);
    console.log("ID de transaccion obtenida: ", idTransaccion);
    console.log("Todo lo que retorna const 'transaccion': ", transaccion);
    if (!transaccion) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    // Buscar presupuesto embebido dentro del usuario según id de la transacción
    const presupuesto = usuario.presupuestos.id(transaccion.presupuesto_asociado);
    if (!presupuesto) {
      return res.status(404).json({ mensaje: "Presupuesto no encontrado" });
    }

    // Buscar categoría dentro del presupuesto
    const categoriaPresupuesto = presupuesto.categorias.find(
      c => c.categoria._id.toString() === transaccion.categoria_asociada.toString()
    );
    if (!categoriaPresupuesto) {
      return res.status(404).json({ mensaje: "Categoría no encontrada en presupuesto" });
    }

    const monto = transaccion.monto;
    const accion = transaccion.accion.toLowerCase();

    // Revertir cambios en dinero disponible según acción
    if (accion === "retiro") {
      presupuesto.dinero_disponible += monto;
      categoriaPresupuesto.dinero_disponible += monto;
    } else if (accion === "ingreso") {
      presupuesto.dinero_disponible -= monto;
      categoriaPresupuesto.dinero_disponible -= monto;

      if (presupuesto.dinero_disponible < 0 || categoriaPresupuesto.dinero_disponible < 0) {
        return res.status(400).json({ mensaje: "No se puede eliminar la transacción porque resultaría en saldo negativo" });
      }
    } else {
      return res.status(400).json({ mensaje: "Acción inválida en transacción" });
    }

    // Remover la transacción del array de transacciones del usuario (reemplazo de transaccion.remove())
    usuario.transacciones = usuario.transacciones.filter(
      t => t._id.toString() !== idTransaccion
    );

    // Guardar usuario con cambios
    await usuario.save();

    // Opcional: actualizar historial
    usuario.historial.push({
      accion: "Eliminación de Transacción",
      tipo: "transaccion",
      descripcion: `Se eliminó una transacción de tipo ${accion}`,
      detalles: transaccion,
      fecha: new Date(),
    });

    // Limpiar historial
    usuario.historial = usuario.historial
      .filter(item => item.fecha >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: "Transacción eliminada correctamente, presupuesto actualizado",
      presupuestoActualizado: presupuesto,
    });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};


exports.crearTransaccionMetaAhorro = async (req, res) => {
  const { idUsuario } = req.params;
  const datos = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    let metaAhorro = null;
    if (datos.meta_ahorro_id) {
      metaAhorro = usuario.metas_ahorro.id(datos.meta_ahorro_id);
      if (!metaAhorro) {
        return res.status(404).json({ mensaje: "Meta de ahorro no encontrada" });
      }

      // Validaciones
      if (datos.tipo === "retiro") {
        if (metaAhorro.ahorrado === 0) {
          return res.status(400).json({ mensaje: "No hay dinero ahorrado para retirar" });
        }
        if (datos.monto > metaAhorro.ahorrado) {
          return res.status(400).json({ mensaje: "El monto supera lo ahorrado" });
        }
        metaAhorro.ahorrado -= datos.monto;
      } else if (datos.tipo === "deposito") {
        if ((metaAhorro.ahorrado + datos.monto) > metaAhorro.objetivo) {
          return res.status(400).json({ mensaje: "El monto excede el objetivo de la meta" });
        }
        metaAhorro.ahorrado += datos.monto;
      } else {
        return res.status(400).json({ mensaje: "Tipo de transacción inválido" });
      }
    }

    // Agregar transacción
    const nuevaTransaccion = {
      ...datos,
      fecha: new Date(datos.fecha),
      monto: datos.monto,
    };
    usuario.transacciones.push(nuevaTransaccion);
    await usuario.save();

    res.status(201).json({ mensaje: "Transacción registrada correctamente", transaccion: nuevaTransaccion });
  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

exports.actualizarTransaccionMetaAhorro = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;
  const nuevosDatos = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const transaccion = usuario.transacciones.id(idTransaccion);
    if (!transaccion) return res.status(404).json({ mensaje: "Transacción no encontrada" });

    let metaAnterior = null;
    let metaNueva = null;

    // REVERTIR efecto de la transacción anterior si estaba vinculada a una meta
    if (transaccion.meta_ahorro_id) {
      metaAnterior = usuario.metas_ahorro.id(transaccion.meta_ahorro_id);
      if (metaAnterior) {
        if (transaccion.tipo === "retiro") {
          metaAnterior.ahorrado += transaccion.monto;
          if (metaAnterior.ahorrado > metaAnterior.objetivo) {
            metaAnterior.ahorrado = metaAnterior.objetivo;
          }
        } else if (transaccion.tipo === "deposito") {
          metaAnterior.ahorrado -= transaccion.monto;
          if (metaAnterior.ahorrado < 0) metaAnterior.ahorrado = 0;
        }
      }
    }

    // APLICAR efecto de los nuevos datos si tiene meta_ahorro_id
    if (nuevosDatos.meta_ahorro_id) {
      metaNueva = usuario.metas_ahorro.id(nuevosDatos.meta_ahorro_id);
      if (!metaNueva) {
        return res.status(404).json({ mensaje: "Meta de ahorro nueva no encontrada" });
      }

      if (nuevosDatos.tipo === "retiro") {
        if (metaNueva.ahorrado === 0) {
          return res.status(400).json({ mensaje: "No hay dinero ahorrado para retirar" });
        }
        if (nuevosDatos.monto > metaNueva.ahorrado) {
          return res.status(400).json({ mensaje: "El nuevo monto excede lo ahorrado" });
        }
        metaNueva.ahorrado -= nuevosDatos.monto;
      } else if (nuevosDatos.tipo === "deposito") {
        if ((metaNueva.ahorrado + nuevosDatos.monto) > metaNueva.objetivo) {
          return res.status(400).json({ mensaje: "El nuevo monto excede el objetivo de la meta" });
        }
        metaNueva.ahorrado += nuevosDatos.monto;
      } else {
        return res.status(400).json({ mensaje: "Tipo de transacción inválido" });
      }
    }

    // ACTUALIZAR transacción
    transaccion.tipo = nuevosDatos.tipo;
    transaccion.monto = nuevosDatos.monto;
    transaccion.categoria = nuevosDatos.categoria;
    transaccion.descripcion = nuevosDatos.descripcion;
    transaccion.fecha = new Date(nuevosDatos.fecha);
    transaccion.meta_ahorro_id = nuevosDatos.meta_ahorro_id || null;

    await usuario.save();

    res.status(200).json({ mensaje: "Transacción actualizada correctamente", transaccion });
  } catch (error) {
    console.error("Error al actualizar transacción:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
};


exports.eliminarTransaccionMetaAhorro = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const transaccion = usuario.transacciones.id(idTransaccion);
    if (!transaccion) return res.status(404).json({ mensaje: "Transacción no encontrada" });

    // Si estaba asociada a una meta de ahorro
    if (transaccion.meta_ahorro_id) {
      const metaAhorro = usuario.metas_ahorro.id(transaccion.meta_ahorro_id);
      if (metaAhorro) {
        if (transaccion.tipo === "retiro") {
          metaAhorro.ahorrado += transaccion.monto;
          // No dejar exceder el objetivo al revertir (por precaución)
          if (metaAhorro.ahorrado > metaAhorro.objetivo) {
            metaAhorro.ahorrado = metaAhorro.objetivo;
          }
        } else if (transaccion.tipo === "deposito") {
          metaAhorro.ahorrado -= transaccion.monto;
          if (metaAhorro.ahorrado < 0) metaAhorro.ahorrado = 0;
        }
      }
    }

    transaccion.remove();
    await usuario.save();

    res.status(200).json({ mensaje: "Transacción eliminada y efectos revertidos correctamente" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
