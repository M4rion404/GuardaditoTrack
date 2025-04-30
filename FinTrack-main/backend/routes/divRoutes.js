const express = require('express');
const router = express.Router();
const divisaController = require('../controllers/divController');

router.post('/', divisaController.crearDivisa);
router.get('/', divisaController.obtenerDivisas);
router.get('/:id', divisaController.obtenerDivisaPorId);
router.put('/:id', divisaController.actualizarDivisa);
router.delete('/:id', divisaController.eliminarDivisa);

module.exports = router;
