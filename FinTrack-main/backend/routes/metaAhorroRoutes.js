const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaAhorroController');

router.post('/:idUsuario/', metaController.crearMeta);
router.get('/:idUsuario/', metaController.obtenerMetas);
router.get('/:idUsuario/:idMetaAhorro/', metaController.obtenerMetaPorId);
router.patch('/:idUsuario/:idMetaAhorro/', metaController.actualizarMeta);
router.delete('/:idUsuario/:idMetaAhorro/', metaController.eliminarMeta);

module.exports = router;
