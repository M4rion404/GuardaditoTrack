// Importar el modelo de Usuario
const auth = require('../auth/auth');
const Usuario = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { enviarSMS } = require('../services/twilio_service');
const { enviarEMAIL } = require('../services/mailJet_service');


const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}; // VALIDAR EMAIL

exports.crearUsuario = async (req, res) => {
  const { email, contraseña, nombres, numero_telefono, msj } = req.body;

  /* Validaciones */
  if (!email || !contraseña || !nombres) { return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });}
  if (!validarEmail(email)) { return res.status(400).json({ mensaje: 'Email no válido' });}

  try {
  
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    
    res.status(201).json(nuevoUsuario);
    
    // Si regresan un True se envía a Whatsapp, si no al correo
    // msj 
    //   ? await enviarSMS(numero_telefono, nombres) 
    //   : await enviarEmail(email, nombres);
    
    await enviarSMS(numero_telefono, nombres) 
    await enviarEMAIL(email, nombres, "FinTrack: Registro éxitoso","");
  
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear usuario', error });
  }
}; // CREAR USUARIO

exports.iniciarSesion = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    
    const usuario = await Usuario.findOne({ email });
    const esValida = usuario ? await bcrypt.compare(contraseña, usuario.contraseña) : false;

    if (!usuario || !esValida) {
      return res.status(401).json({
        code: '401',
        mensaje: 'Las credenciales no son válidas, verifique su usuario o contraseña'
      });
    }

    const token = auth.firmarToken ({ id: usuario._id, email: usuario.email });
    auth.crearCookie (res, token);
    
    /*
     *
     * Respuesta para el frontend, para corroborar
     * si la información que se envió es la 
     * deseada.
     * 
    */
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario._id,
        nombres: usuario.nombres,
        email: usuario.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}; // INICIAR SESIÓN

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
