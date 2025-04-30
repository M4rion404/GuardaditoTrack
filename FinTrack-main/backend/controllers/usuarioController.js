// Importar el modelo de Usuario
const Usuario = require('../models/Usuarios');

// Función para validar el email (opcional)
const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

exports.crearUsuario = async (req, res) => {
  const { email, contraseña, nombres } = req.body;

  // Validación básica de datos
  if (!email || !contraseña || !nombres) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  if (!validarEmail(email)) {
    return res.status(400).json({ mensaje: 'Email no válido' });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear usuario', error });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};
