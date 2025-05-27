// Importar el modelo de Usuario
const auth = require('../auth/auth');
const Usuario = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { enviarSMS } = require('../services/twilio_service');
const { enviarCorreo } = require('../services/mailJet_service');


const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}; // VALIDAR EMAIL

exports.crearUsuario = async (req, res) => {
  
  // Extraer datos del body
  const { 
    email, 
    contraseña, 
    nombre_usuario, 
    numero_telefono, 
    verificacion 
  } = req.body;

  /* VALIDACIONES: Campos vacíos o Email inválido */
  if (!email || !contraseña || !nombre_usuario)  
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  
  if (!validarEmail(email)) 
    return res.status(400).json({ mensaje: 'Email no válido' });

 
  try {
  
    const usuarioExistente = await Usuario.findOne({ email });
    
    if (usuarioExistente) 
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    await enviarCorreo(email, "Bienvenido a Fintrack" , nombre_usuario);
    
    
    res.status(201).json(nuevoUsuario);
  
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear usuario', error });
  }
}; // CREAR USUARIO

exports.iniciarSesion = async (req, res) => {
  
  const { email, contraseña } = req.body;

  try {
    
    const usuario = await Usuario.findOne({ email });
    const esValida = usuario ? await bcrypt.compare(contraseña, usuario.contraseña) : false;

    if (!usuario || !esValida)
      return res.status(401).json({ code: '401', mensaje: 'Las credenciales no son válidas, verifique su usuario o contraseña' });
    

    const token = auth.firmarToken({ id: usuario._id, email: usuario.email });
    auth.crearCookie(res, token);

    // Elimina la contraseña del objeto antes de enviarlo (buena práctica)
    const usuarioSinContraseña = usuario.toObject(); // Convierte a objeto plano
    delete usuarioSinContraseña.contraseña;

    res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      usuario: usuarioSinContraseña, 
      token: token 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; // INICIAR SESION

exports.eliminarUsuario = async (req, res) => {
  
  const idUsuario = req.params.idUsuario;

  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(idUsuario);

    if (!usuarioEliminado) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente', usuario: usuarioEliminado });
    
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
  }

};// ELIMINAR USUARIO

exports.cerrarSesion = (req, res) => {
  res.clearCookie('token');
  res.json({ mensaje: 'Sesión cerrada correctamente' });
}; // CERRAR SESIÓN

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
}; // OBTENER USUARIOS

exports.actualizarPreferencias = async (req, res) => {
  const { idUsuario } = req.params;
  const { tipo_divisa, verificacion } = req.body;

  if (!['sms', 'email'].includes(verificacion)) 
    return res.status(400).json({ mensaje: 'El tipo de verificación debe ser "sms" o "email"' });
  

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.verificacion = verificacion;
    await usuario.save();

    res.status(200).json({ mensaje: 'Preferencias actualizadas correctamente', usuario });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar preferencias', error: error.message});
  }
}; // ACTUALIZAR PREFERENCIAS}

exports.actualizarUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    const usuarioActual = await Usuario.findById(idUsuario);
    if (!usuarioActual) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }


    const datosActualizados = {};


    ['nombres', 'apellido_paterno', 'apellido_materno'].forEach(campo => {
      if (updates[campo] !== undefined) {
        datosActualizados[campo] = updates[campo].trim() || usuarioActual[campo];
      }
    });

    // Campo booleano (notificacion)
    if (updates.notificacion !== undefined) {
      datosActualizados.notificacion = updates.notificacion;
    }

    // Mapear divisa a tipo_divisa (según tu esquema)
    if (updates.divisa !== undefined && Array.isArray(updates.divisa)) {
      if (updates.divisa.length === 0) {
        // Si no hay divisas seleccionadas, mantener al menos una del usuario actual
        datosActualizados.tipo_divisa = usuarioActual.tipo_divisa.length > 0 
          ? [usuarioActual.tipo_divisa[0]] 
          : [{ divisa: "USD", nombre: "Dólar estadounidense" }];
      } else {
        datosActualizados.tipo_divisa = updates.divisa;
      }
    }

    // Mapear tipo_verificacion a verificacion (según tu esquema)
    if (updates.tipo_verificacion !== undefined) {
      if (updates.tipo_verificacion === "") {
        // Si no se selecciona verificación, mantener la actual
        datosActualizados.verificacion = usuarioActual.verificacion;
      } else {
        datosActualizados.verificacion = updates.tipo_verificacion;
      }
    }

    // Actualizar el usuario con los nuevos datos
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      idUsuario,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );

    res.json({ 
      message: "Usuario actualizado correctamente", 
      usuario: usuarioActualizado 
    });

  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
 // ActualizarUsuario