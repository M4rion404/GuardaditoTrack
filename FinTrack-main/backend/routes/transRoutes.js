const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transController');

// Rutas CRUD para transacciones
router.post('/', transaccionController.crearTransaccion);
router.get('/', transaccionController.obtenerTransacciones);
router.get('/:id', transaccionController.obtenerTransaccionPorId);
router.put('/:id', transaccionController.actualizarTransaccion);
router.delete('/:id', transaccionController.eliminarTransaccion);

module.exports = router;
