//transController.js
const mongoose = require("mongoose");
const Usuario = require("../models/Usuarios");
const Transaccion = require("../models/Transaccion");

exports.crearTransaccion = async (req, res) => {

  const idUsuario = req.params.idUsuario;
  const { tipo_transaccion, ...nuevaTransaccion } = req.body;

  try {

    const usuario = await Usuario.findById(idUsuario);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });


    if (tipo_transaccion === "meta") {

      const meta_ahorro = usuario.metas_ahorro.find(
        (meta) => meta._id.toString() === nuevaTransaccion.meta_asociada
      );

      if (!meta_ahorro)
        return res.status(404).json({ mensaje: "La meta de ahorro no ha sido encontrada" });


      // Actualizar dinero disponible en presupuesto y categoría según acción
      if (nuevaTransaccion.accion.toLowerCase() === "retiro") {
        meta_ahorro.ahorrado -= nuevaTransaccion.monto;

      } else if (nuevaTransaccion.accion.toLowerCase() === "ingreso") {
        meta_ahorro.ahorrado += nuevaTransaccion.monto;
      } else {
        return res.status(400).json({
          mensaje: "Ha ocurrido un error al en el proceso de ajuste automático"
        });
      }

      if (meta_ahorro.ahorrado < 0) {
        return res.status(400).json({
          mensaje: "Fondos insuficientes para esta transacción"
        });
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
        mensaje: "La transacción se ha realizado con éxito, meta de ahorro actualizada",
        transaccion: nuevaTransaccion,
        metaActualizado: meta_ahorro,
      });


    } else {

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

      // Validar que dinero disponible no sea negativo
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
        .filter(item => item.fecha >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
        .sort((a, b) => b.fecha - a.fecha)
        .slice(0, 150);

      // Forzar a Mongoose a detectar cambios en subdocumentos
      usuario.markModified('presupuestos');

      await usuario.save();

      res.status(200).json({
        mensaje: "La transacción se ha realizado con éxito, presupuesto actualizado",
        transaccion: nuevaTransaccion,
        presupuestoActualizado: presupuesto,
      });


    }


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
const esTransaccionDeMeta = (trans) => trans.meta_asociada && (!trans.presupuesto_asociado || trans.presupuesto_asociado === "");

exports.obtenerTransaccionPorId = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const transaccion = usuario.transacciones.id(idTransaccion);
    if (!transaccion) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    res.status(200).json(transaccion);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la transacción", error: error.message });
  }
};

exports.actualizarTransaccion = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;
  const nuevosDatos = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const index = usuario.transacciones.findIndex(t => t._id.toString() === idTransaccion);
    if (index === -1) return res.status(404).json({ mensaje: "Transacción no encontrada" });

    const transAnterior = usuario.transacciones[index];
    const esMeta = esTransaccionDeMeta(transAnterior);

    if (esMeta) {
      const meta = usuario.metas_ahorro.id(transAnterior.meta_asociada);
      if (!meta) return res.status(404).json({ mensaje: "Meta de ahorro no encontrada" });

      if (transAnterior.accion === "Ingreso") meta.ahorrado -= transAnterior.monto;
      else meta.ahorrado += transAnterior.monto;

      if (nuevosDatos.accion === "Ingreso") meta.ahorrado += nuevosDatos.monto;
      else meta.ahorrado -= nuevosDatos.monto;

      if (meta.ahorrado < 0) return res.status(400).json({ mensaje: "Fondos insuficientes en meta" });

    } else {
      const presAnt = usuario.presupuestos.id(transAnterior.presupuesto_asociado);
      if (!presAnt) return res.status(404).json({ mensaje: "Presupuesto anterior no encontrado" });

      const catAnt = presAnt.categorias.find(c => c.categoria && c.categoria._id.toString() === transAnterior.categoria_asociada.toString());
      if (!catAnt) return res.status(404).json({ mensaje: "Categoría anterior no encontrada" });

      if (transAnterior.accion === "Ingreso") {
        presAnt.dinero_disponible -= transAnterior.monto;
        catAnt.dinero_disponible -= transAnterior.monto;
      } else {
        presAnt.dinero_disponible += transAnterior.monto;
        catAnt.dinero_disponible += transAnterior.monto;
      }

      const nuevoPres = usuario.presupuestos.id(nuevosDatos.presupuesto_asociado);
      const nuevaCat = nuevoPres?.categorias.find(c => c.categoria._id.toString() === nuevosDatos.categoria_asociada);

      if (!nuevoPres || !nuevaCat) return res.status(404).json({ mensaje: "Nuevo presupuesto o categoría no encontrada" });

      if (nuevosDatos.accion === "Ingreso") {
        nuevoPres.dinero_disponible += nuevosDatos.monto;
        nuevaCat.dinero_disponible += nuevosDatos.monto;
      } else {
        if (nuevoPres.dinero_disponible - nuevosDatos.monto < 0 || nuevaCat.dinero_disponible - nuevosDatos.monto < 0)
          return res.status(400).json({ mensaje: "Fondos insuficientes en presupuesto/categoría" });

        nuevoPres.dinero_disponible -= nuevosDatos.monto;
        nuevaCat.dinero_disponible -= nuevosDatos.monto;
      }
    }

    usuario.transacciones[index] = { ...usuario.transacciones[index]._doc, ...nuevosDatos };
    usuario.historial.push({
      accion: "Actualización de Transacción",
      tipo: "transaccion",
      datos_antes: transAnterior,
      datos_despues: nuevosDatos,
      fecha: new Date(),
    });

    usuario.markModified("presupuestos");
    await usuario.save();

    res.status(200).json({ mensaje: "Transacción actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la transacción", error: error.message });
  }
};

exports.eliminarTransaccion = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const transaccion = usuario.transacciones.id(idTransaccion);
    if (!transaccion) return res.status(404).json({ mensaje: "Transacción no encontrada" });

    const esMeta = esTransaccionDeMeta(transaccion);

    if (esMeta) {
      const meta = usuario.metas_ahorro.id(transaccion.meta_asociada);
      if (!meta) return res.status(404).json({ mensaje: "Meta de ahorro no encontrada" });

      if (transaccion.accion === "Ingreso") meta.ahorrado -= transaccion.monto;
      else meta.ahorrado += transaccion.monto;

      if (meta.ahorrado < 0) return res.status(400).json({ mensaje: "Fondos insuficientes en meta tras revertir" });

    } else {
      const presupuesto = usuario.presupuestos.id(transaccion.presupuesto_asociado);
      if (!presupuesto) return res.status(404).json({ mensaje: "Presupuesto no encontrado" });

      const categoria = presupuesto.categorias.find(
        c => c.categoria._id.toString() === transaccion.categoria_asociada.toString()
      );
      if (!categoria) return res.status(404).json({ mensaje: "Categoría no encontrada" });

      if (transaccion.accion === "Ingreso") {
        presupuesto.dinero_disponible -= transaccion.monto;
        categoria.dinero_disponible -= transaccion.monto;
      } else {
        presupuesto.dinero_disponible += transaccion.monto;
        categoria.dinero_disponible += transaccion.monto;
      }
    }

    usuario.transacciones = usuario.transacciones.filter(
      t => t._id.toString() !== idTransaccion
    );

    usuario.historial.push({
      accion: "Eliminación de Transacción",
      tipo: "transaccion",
      descripcion: `Se eliminó una transacción`,
      detalles: transaccion,
      fecha: new Date(),
    });

    usuario.markModified("presupuestos");
    await usuario.save();

    res.status(200).json({ mensaje: "Transacción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar transacción", error: error.message });
  }
};