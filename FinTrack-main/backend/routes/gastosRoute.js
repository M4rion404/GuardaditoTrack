// Imnportar las dependencias necesarias
const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastosController');

// Definir las rutas para manejar los gastos
router.post('/', gastoController.createGasto);
router.get('/', gastoController.getGastos);

module.exports = router;
