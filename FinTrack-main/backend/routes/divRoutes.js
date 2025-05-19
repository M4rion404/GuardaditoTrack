const express = require('express');
const router = express.Router();
const divisaController = require('../controllers/divController');

router.post('/:idUsuario', divisaController.crearDivisa);
router.get('/:idUsuario', divisaController.obtenerDivisas);
router.get('/:idUsuario/:idDivisa', divisaController.obtenerDivisaPorId);
router.put('/:idUsuario/:idDivisa', divisaController.actualizarDivisa);
router.delete('/:idUsuario/:idDivisa', divisaController.eliminarDivisa);

module.exports = router;
