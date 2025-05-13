// Importar el modelo de Usuario
const Usuario = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.SECRET_KEY; 

const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

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
};

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

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombres: usuario.nombres,
        email: usuario.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ mensaje: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};
