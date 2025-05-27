const express = require('express');
const router = express.Router();
const transController = require('../controllers/transController');


// Presupuestos
router.get('/:idUsuario/', transController.obtenerTransacciones);
router.get('/:idUsuario/:idTransaccion/', transController.obtenerTransaccionPorId);

router.post('/:idUsuario/', transController.crearTransaccion);
router.put('/:idUsuario/:idTransaccion/', transController.actualizarTransaccion);
router.delete('/:idUsuario/:idTransaccion/', transController.eliminarTransaccion);

module.exports = router;