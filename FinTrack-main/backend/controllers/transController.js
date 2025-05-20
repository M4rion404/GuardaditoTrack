//transController.js
const mongoose = require('mongoose');
const Usuario = require('../models/Usuarios');
const Transaccion = require('../models/Transaccion');

exports.crearTransaccion = async (req, res) => {

  const idUsuario = req.params.idUsuario;
  const nuevaTransaccion = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Buscar presupuesto afectado
    const presupuesto = usuario.presupuestos.find(p => p._id.toString() === nuevaTransaccion.id_presupuesto);
    if (!presupuesto) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    const monto = parseFloat(nuevaTransaccion.monto);
    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({ mensaje: 'Monto inválido' });
    }

    // Validar retiro
    if (nuevaTransaccion.tipo === 'Retiro') {
      if (presupuesto.dinero_disponible < monto) {
        return res.status(400).json({ mensaje: 'Fondos insuficientes para realizar el retiro' });
      }
      presupuesto.dinero_disponible -= monto;
    } else if (nuevaTransaccion.tipo === 'Ingreso') {
      presupuesto.dinero_disponible += monto;
    } else {
      return res.status(400).json({ mensaje: 'Tipo de transacción inválido' });
    }

    // Agregar la transacción
    usuario.transacciones.push(nuevaTransaccion);

    // Agregar al historial
    usuario.historial.push({
      accion: 'Creación de Transacción',
      tipo: 'transaccion',
      descripcion: `${nuevaTransaccion.tipo === 'retiro' ? 'Retiró' : 'Ingresó'} $${monto} en presupuesto`,
      detalles: nuevaTransaccion,
      fecha: new Date()
    });

    // Mantener historial limpio
    usuario.historial = usuario.historial
      .filter(item => item.fecha >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    await usuario.save();

    res.status(200).json({ mensaje: 'Transacción realizada con éxito', transaccion: nuevaTransaccion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear transacción', error: error.message });
  }
}; // CREAR TRANSACCION


exports.obtenerTransacciones = async (req, res) => {
  const idUsuario = req.params.idUsuario;


  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    console.log('Transacciones obetnidas', usuario.Transacciones)
    res.status(200).json(usuario.Transacciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener transacciones', error: error.message });
  }
}

exports.obtenerTransaccionPorId = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;


  try {
    const usuario = await Usuario.findById(idUsuario);
    console.log(usuario)
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    const transaccion = usuario.Transacciones.id(idTransaccion);
    if (!transaccion) {
      return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    }
    console.log('Transaccion obtenida', transaccion)
    res.status(200).json(transaccion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la transacción', error: error.message });
  }
}

exports.actualizarTransaccion = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;
  const datosActualizados = req.body;


  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    const index = usuario.Transacciones.findIndex(t => t._id.toString() === idTransaccion);
    if (index === -1) {
      return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    }

    // Definir los datos antes de la actualización (guardar los datos originales)
    const datosAntes = {
      titulo: usuario.Transacciones[index].titulo,
      descripcion: usuario.Transacciones[index].descripcion,
      accion: usuario.Transacciones[index].accion,
      metodo_pago: usuario.Transacciones[index].metodo_pago,
      monto: usuario.Transacciones[index].monto,
      categoria_asociada: usuario.Transacciones[index].categoria_asociada,
      presupuesto_asociado: usuario.Transacciones[index].presupuesto_asociado
    };

    // Actualizacion de la transaccion
    usuario.Transacciones[index].titulo = datosActualizados.titulo ?? usuario.Transacciones[index].titulo;
    usuario.Transacciones[index].descripcion = datosActualizados.descripcion ?? usuario.Transacciones[index].descripcion;
    usuario.Transacciones[index].accion = datosActualizados.accion ?? usuario.Transacciones[index].accion;
    usuario.Transacciones[index].metodo_pago = datosActualizados.metodo_pago ?? usuario.Transacciones[index].metodo_pago;
    usuario.Transacciones[index].monto = datosActualizados.monto ?? usuario.Transacciones[index].monto;
    usuario.Transacciones[index].categoria_asociada = datosActualizados.categoria_asociada ?? usuario.Transacciones[index].categoria_asociada;
    usuario.Transacciones[index].presupuesto_asociado = datosActualizados.presupuesto_asociado ?? usuario.Transacciones[index].presupuesto_asociado;


    await usuario.save();

    // Agregar el historial (registro de actualización)
    await Usuario.findByIdAndUpdate(idUsuario, {
      $push: {
        Historial: {
          accion: 'Actualizacion de Transaccion',
          tipo: 'transaccion',
          datos_antes: datosAntes,
          datos_despues: usuario.Transacciones[index],
        },
      },
    });

    console.log('Transacción actualizada', usuario.Transacciones[index]);
    res.status(200).json({ mensaje: 'Transacción actualizada correctamente', transaccion: usuario.Transacciones[index] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la transacción', error: error.message });
  }
}

exports.eliminarTransaccion = async (req, res) => {
  const { idUsuario, idTransaccion } = req.params;


  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    // Buscar la transacción antes de eliminarla
    const transaccionEliminada = usuario.Transacciones.find(
      t => t._id.toString() === idTransaccion
    );


    if (!transaccionEliminada) {
      return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    }


    // Filtrar la transacción
    usuario.Transacciones = usuario.Transacciones.filter(
      t => t._id.toString() !== idTransaccion
    );


    await usuario.save();

    await Usuario.findByIdAndUpdate(idUsuario, {
      $push: {
        Historial: {
          accion: 'Eliminacion de Transaccion',
          tipo: 'transaccion',
          datos_antes: transaccionEliminada,
          datos_despues: {}, // Datos después de la eliminación (vacío)
        },
      },
    });

    console.log('Transacción eliminada:', transaccionEliminada);
    res.status(200).json({
      mensaje: 'Transacción eliminada correctamente',
      transaccionEliminada
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar la transacción',
      error: error.message
    });
  }
};
