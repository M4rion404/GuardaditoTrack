/* const Transaccion = require('../models/Transaccion');

// Crear nueva transacción
exports.crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = new Transaccion(req.body);
    const transaccionGuardada = await nuevaTransaccion.save();
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear transacción', detalles: error.message });
  }
};

// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find().populate('categoria usuario');
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones', detalles: error.message });
  }
};

// Obtener una transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id).populate('categoria usuario');
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar transacción', detalles: error.message });
  }
};

// Actualizar una transacción
exports.actualizarTransaccion = async (req, res) => {
  try {
    const transaccionActualizada = await Transaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transaccionActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar transacción', detalles: error.message });
  }
};

// Eliminar una transacción
exports.eliminarTransaccion = async (req, res) => {
  try {
    await Transaccion.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Transacción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transacción', detalles: error.message });
  }
};
 */

//transController.js
const mongoose = require('mongoose');
const Usuario = require('../models/Usuarios');
const Transaccion = require('../models/Transaccion');
/* const Historial = require('../models/Historial');


// Crear nueva transacción
exports.crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = new Transaccion(req.body);
    const transaccionGuardada = await nuevaTransaccion.save();




    await Historial.create({
      usuario: 'test',
      accion: 'Creacion de transaccion',
      tipo: 'transaccion',
      datos_despues: transaccionGuardada.toObject()
    })


    res.status(201).json(transaccionGuardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear transacción', detalles: error.message });
  }
};


// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find().populate('categoria usuario');
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones', detalles: error.message });
  }
};


// Obtener una transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id).populate('categoria usuario');
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar transacción', detalles: error.message });
  }
};


// Actualizar una transacción
exports.actualizarTransaccion = async (req, res) => {
  const { id } = req.params;
  const nuevosDatos = req.body;


  console.log('Inicio de la actualizacion de transaccion')


  try {
    const transaccionAntes = await Transaccion.findById(id);
    if(!transaccionAntes){
      return res.status(400).json({error: "Transaccion no encontrada"})
    }


    console.log('Transaccion antes de la actualizacion', transaccionAntes)


    const transaccionDespues = await Transaccion.findByIdAndUpdate(id, nuevosDatos, {new: true})


    console.log('Transaccion despues de la actualizacion', transaccionDespues)


    const nuevoHistorial = new Historial({
      usuario: req.body.usuario || 'test',
      accion: 'Actualizar transaccion',
      tipo: "transaccion",
      datos_antes: transaccionAntes.toObject(),
      datos_despues: transaccionDespues.toObject()
    })


    console.log('Intentando guardar Historial')


    await nuevoHistorial.save()


    console.log('Historial guardado con exito')
    console.log('Historial Creado', nuevoHistorial)


    res.json(transaccionDespues);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar transacción', detalles: error.message });
  }
};


// Eliminar una transacción
exports.eliminarTransaccion = async (req, res) => {
  const { id } = req.params;
  console.log('Solicitud de eliminacion recibida')


  try {
    const transaccionEliminada = await Transaccion.findByIdAndDelete(id);


    if(!transaccionEliminada) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }


    console.log('Transaccion eliminada', transaccionEliminada)
    const nuevoHistorial = new Historial({
      usuario: req.body.usuario || 'test',
      accion: 'Eliminar transaccion',
      tipo: 'transaccion',
      datos_antes: transaccionEliminada.toObject(),
      datos_despues: null
    })


    await nuevoHistorial.save()


    console.log('Historial de eliminacion guardado', nuevoHistorial)


    res.json({ mensaje: 'Transacción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transacción', detalles: error.message });
  }
};
 */




exports.crearTransaccion = async (req, res) => {


  const idUsuario = req.params.idUsuario; // ID del usuario
  const nuevaTransaccion = req.body;


  try {
    console.log('ID recibido: ', idUsuario)
    const usuarioExiste = await Usuario.findById(idUsuario);
    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      idUsuario,
      { $push: { Transacciones: nuevaTransaccion } },
      { new: true }
    );


    console.log('Usuario actualizado', usuarioActualizado);
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear transacción', error: error.message });
  }
}


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
    usuario.Transacciones[index].titulo = datosActualizados.titulo ?? usuario.Transacciones[index].titulo;
    usuario.Transacciones[index].descripcion = datosActualizados.descripcion ?? usuario.Transacciones[index].descripcion;
    usuario.Transacciones[index].accion = datosActualizados.accion ?? usuario.Transacciones[index].accion;
    usuario.Transacciones[index].metodo_pago = datosActualizados.metodo_pago ?? usuario.Transacciones[index].metodo_pago;
    usuario.Transacciones[index].monto = datosActualizados.monto ?? usuario.Transacciones[index].monto;
    usuario.Transacciones[index].estado = datosActualizados.estado ?? usuario.Transacciones[index].estado;


    await usuario.save();
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
