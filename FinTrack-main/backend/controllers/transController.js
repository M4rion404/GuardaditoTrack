//transController.js
const mongoose = require("mongoose");
const Usuario = require("../models/Usuarios");
const Transaccion = require("../models/Transaccion");

exports.crearTransaccion = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const nuevaTransaccion = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    console.log('usuario.presupuestos:', usuario.presupuestos);
    if (!usuario) {
      console.log("Error 404: Usuario no encontrado");
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    console.log("id_presupuesto recibido:", nuevaTransaccion.id_presupuesto);
    // Buscar presupuesto afectado
    const presupuesto = usuario.presupuestos.find(
      (p) => p._id.toString() === nuevaTransaccion.id_presupuesto
    );
    console.log("id_presupuesto recibido:", nuevaTransaccion.id_presupuesto);
    console.log(
      "Presupuestos del usuario:",
      usuario.presupuestos.map((p) => p._id.toString())
    );

    if (!presupuesto) {
      console.log("Error 404: Presupuesto no encontrado");
      return res.status(404).json({ mensaje: "Presupuesto no encontrado" });
    }
/* 
    const monto = parseFloat(nuevaTransaccion.monto);
    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({ mensaje: "Monto inválido" });
    }

    // Validar retiro
    if (nuevaTransaccion.tipo === "Retiro") {
      if (presupuesto.dinero_disponible < monto) {
        return res
          .status(400)
          .json({ mensaje: "Fondos insuficientes para realizar el retiro" });
      }
      presupuesto.dinero_disponible -= monto;
    } else if (nuevaTransaccion.tipo === "Ingreso") {
      presupuesto.dinero_disponible += monto;
    } else {
      return res.status(400).json({ mensaje: "Tipo de transacción inválido" });
    } */

    // Agregar la transacción
    usuario.transacciones.push(nuevaTransaccion);

    // Agregar al historial
    usuario.historial.push({
      accion: "Creación de Transacción",
      tipo: "transaccion",
      descripcion: `${
        nuevaTransaccion.tipo === "retiro" ? "Retiró" : "Ingresó"
      }`,
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

    await usuario.save();

    res
      .status(200)
      .json({
        mensaje: "Transacción realizada con éxito",
        transaccion: nuevaTransaccion,
      });
  } catch (error) {
    console.log("Error 500 en crear: ", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear transacción", error: error.message });
  }
}; // CREAR TRANSACCION

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
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      console.log("404 usuario: Usuario no encontrado")
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const index = usuario.transacciones.findIndex(
      (t) => t._id.toString() === idTransaccion
    );
    if (index === -1) {
      console.log("404 Transaccion: Transaccion no encontrada")
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    // Definir los datos antes de la actualización (guardar los datos originales)
    const datosAntes = {
      titulo: usuario.transacciones[index].titulo,
      descripcion: usuario.transacciones[index].descripcion,
      accion: usuario.transacciones[index].accion,
      metodo_pago: usuario.transacciones[index].metodo_pago,
      monto: usuario.transacciones[index].monto,
      categoria_asociada: usuario.transacciones[index].categoria_asociada,
      presupuesto_asociado: usuario.transacciones[index].presupuesto_asociado,
    };

    // Actualizacion de la transaccion
    usuario.transacciones[index].titulo =
      datosActualizados.titulo ?? usuario.transacciones[index].titulo;
    usuario.transacciones[index].descripcion =
      datosActualizados.descripcion ?? usuario.transacciones[index].descripcion;
    usuario.transacciones[index].accion =
      datosActualizados.accion ?? usuario.transacciones[index].accion;
    usuario.transacciones[index].metodo_pago =
      datosActualizados.metodo_pago ?? usuario.transacciones[index].metodo_pago;
    usuario.transacciones[index].monto =
      datosActualizados.monto ?? usuario.transacciones[index].monto;
    usuario.transacciones[index].categoria_asociada =
      datosActualizados.categoria_asociada ??
      usuario.transacciones[index].categoria_asociada;
    usuario.transacciones[index].presupuesto_asociado =
      datosActualizados.presupuesto_asociado ??
      usuario.transacciones[index].presupuesto_asociado;

    await usuario.save();

    // Agregar el historial (registro de actualización)
    await Usuario.findByIdAndUpdate(idUsuario, {
      $push: {
        Historial: {
          accion: "Actualizacion de Transaccion",
          tipo: "transaccion",
          datos_antes: datosAntes,
          datos_despues: usuario.transacciones[index],
        },
      },
    });

    console.log("Transacción actualizada", usuario.transacciones[index]);
    res
      .status(200)
      .json({
        mensaje: "Transacción actualizada correctamente",
        transaccion: usuario.transacciones[index],
      });
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al actualizar la transacción",
        error: error.message,
      });
  }
};

exports.eliminarTransaccion = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Buscar la transacción antes de eliminarla
    const transaccionEliminada = usuario.transacciones.find(
      (t) => t._id.toString() === idTransaccion
    );

    if (!transaccionEliminada) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    // Filtrar la transacción
    usuario.transacciones = usuario.transacciones.filter(
      (t) => t._id.toString() !== idTransaccion
    );

    await usuario.save();

    await Usuario.findByIdAndUpdate(idUsuario, {
      $push: {
        Historial: {
          accion: "Eliminacion de Transaccion",
          tipo: "transaccion",
          datos_antes: transaccionEliminada,
          datos_despues: {}, // Datos después de la eliminación (vacío)
        },
      },
    });

    console.log("Transacción eliminada:", transaccionEliminada);
    res.status(200).json({
      mensaje: "Transacción eliminada correctamente",
      transaccionEliminada,
    });
  } catch (error) {
    console.log("Eror 505 al intentar eliminar una transaccion: ", error);
    res.status(500).json({
      mensaje: "Error al eliminar la transacción",
      error: error.message,
    });
  }
};
