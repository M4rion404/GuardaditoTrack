// Importación de dependencias
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const Usuario = require('../models/Usuarios');
const { verificarCookie } = require('../auth/auth');

// Rutas Registro e Inicio de Sesión
router.post('/', usuarioController.crearUsuario);
router.post('/login', usuarioController.iniciarSesion);
router.delete('/:idUsuario', usuarioController.eliminarUsuario);
router.patch('/:idUsuario/ConfiguracionRapida', usuarioController.actualizarPreferencias);
router.patch('/:idUsuario/ActualizarUsuario', usuarioController.actualizarUsuario);

// Ruta para Admin 
router.get('/', usuarioController.obtenerUsuarios);

module.exports = router;