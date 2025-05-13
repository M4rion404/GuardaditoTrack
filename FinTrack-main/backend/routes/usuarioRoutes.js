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
module.exports = router;