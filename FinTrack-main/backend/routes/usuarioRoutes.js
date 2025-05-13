// Importación de dependencias
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuarios');
const transController = require('../controllers/transController')


require('dotenv').config(); // Cargar variables de entorno desde el archivo .env
const SECRET_KEY = process.env.SECRET_KEY;
console.log("Clave secreta en usuarioRoutes:", SECRET_KEY); // Agregado para depuración


// Ruta para registrar usuario
router.post('/', usuarioController.crearUsuario);


console.log("Tipo de crearTransaccion:", typeof usuarioController.crearTransaccion); // Agregado para depuración
router.get('/:idUsuario/transacciones', transController.obtenerTransacciones);
router.post('/:idUsuario/transacciones', transController.crearTransaccion);




// Ruta para obtener todos los usuarios (ejemplo público)
router.get('/', usuarioController.obtenerUsuarios);


// Ruta para login
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;


  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }


    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }


    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '2h' }
    );
    const refreshToken = jwt.sign(
      { id: usuario._id, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '7d' }
    );


    console.log("Token generado al iniciar sesion:", token); // Agregado para depuración


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
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;


  try {
    const usuario = await Usuario.findById(id).select('-contraseña'); // Excluye la contraseña por seguridad
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
  }
});


// Obtener todos los presupuestos de un usuario específico
router.get('/:id/presupuestos', async (req, res) => {
  const { id } = req.params;


  try {
    const usuario = await Usuario.findById(id).select('Presupuestos');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    res.json(usuario.Presupuestos); // Devuelve solo los presupuestos
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener presupuestos', error: error.message });
  }
});




router.post('/:id/presupuestos', verificarToken, async (req, res) => {
  const { id } = req.params; // ID del usuario
  const nuevoPresupuesto = req.body;


  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    usuario.Presupuestos.push(nuevoPresupuesto); // Agrega al array embebido
    await usuario.save(); // Guarda el usuario con el nuevo presupuesto


    res.status(201).json({ mensaje: 'Presupuesto agregado', presupuestos: usuario.Presupuestos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar presupuesto', error: error.message });
  }
});




// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ mensaje: 'Token requerido' });


  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}


// Ruta protegida de ejemplo
router.get('/usuarios/perfil', verificarToken, async (req, res) => {
  try {
    console.log("ID del usuario desde el token:", req.usuario.id);
    console.log("Email del usuario desde el token:", req.usuario.email);
    // Busca el usuario por ID y excluye la contraseña
    const usuario = await Usuario.findById(req.usuario.id).select('-contraseña');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

/* ORIGINAL
// Importación de dependencias
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const Usuario = require('../models/Usuarios');


// Rutas Registro e Inicio de Sesión
router.post('/', usuarioController.crearUsuario);
router.post('/login', usuarioController.iniciarSesion);


// Ruta para Admin
router.get('/', usuarioController.obtenerUsuarios);
module.exports = router; */
