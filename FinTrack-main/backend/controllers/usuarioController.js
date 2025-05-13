// Importar el modelo de Usuario
const Usuario = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.SECRET_KEY; 

const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}; // VALIDAR EMAIL

exports.crearUsuario = async (req, res) => {
  const { email, contraseña, nombres } = req.body;

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


    /* 
     *
     *  FIRMAR TOKEN
     *    Crea una cadena combinando:
     *      - Id del usuario (la cadena de Mongo) ---> id: usuario._id
     *      - Su correo electrónico ---> email: usuario.email
     *      - La clave secreta (La cadena Hexadecimal de 64 caracteres guardada en el .env) ---> JWT_SECRET
     *      - Un tiempo de vida de 3 minutos ---> expiresIn: '3m'
     * 
    */
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '3m' }
    );

    /*
     *
     *  Se puede considerar la respuesta para el Navegador. 
     * 
     *  CREAR COOKIE
     *    Se crea un archivo que el navegador utilizará para guardar 
     *    la info del usuario de manera temporal, este archivo contiene:
     *      - Nombre: token
     *      - Token firmado: token formado con el idUsuario, email y la variable del .env
     *      - Instrucciones adicionales para el comportamiento del doc como:
     *        1.- httpOnly: Evita que puedan acceder a los datos a través de JS desde el frontend (Ataques XSS)
     *        2.- secure: Indica si se esta utilizando conexión HTTPS
     *        3.- sameSite: Evita que la cookie se enviada a otros dominios, que solo funcione en el frontend (Ataques CSRF)
     *        4.- maxAge: En milisegundos establece por cuanto tiempo se le considera válida la Cookie
     *
     * 
     */
    res.cookie('token', token, {
      httpOnly: true, 
      secure: false,        
      sameSite: 'Strict', 
      maxAge: 2 * 60 * 60 * 1000 
    });

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

function verificarToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}; // VERIFICAR TOKEN

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
}; // OBTENER USUARIOS
