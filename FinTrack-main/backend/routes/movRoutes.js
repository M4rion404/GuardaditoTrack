const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movController');

router.post('/', movimientoController.crearMovimiento);
router.get('/', movimientoController.obtenerMovimientos);
router.get('/:id', movimientoController.obtenerMovimientoPorId);
router.put('/:id', movimientoController.actualizarMovimiento);
router.delete('/:id', movimientoController.eliminarMovimiento);

module.exports = router;
