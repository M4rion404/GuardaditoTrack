const express = require('express');
const router = express.Router();
const transController = require('../controllers/transController');


router.get('/:idUsuario/', transController.obtenerTransacciones);
router.get('/:idUsuario/:idTransaccion/', transController.obtenerTransaccionPorId);


router.post('/:idUsuario/', transController.crearTransaccion);
router.put('/:idUsuario/:idTransaccion/', transController.actualizarTransaccion);
router.delete('/:idUsuario/:idTransaccion/', transController.eliminarTransaccion);


// Metas ahorro
router.post('meta-ahorro/:idUsuario/', transController.crearTransaccionMetaAhorro);
router.put('meta-ahorro/:idUsuario/:idMetaAhorro/', transController.actualizarTransaccionMetaAhorro);
router.delete('meta-ahorro/:idUsuario/:idMetaAhorro/', transController.eliminarTransaccionMetaAhorro);

module.exports = router;