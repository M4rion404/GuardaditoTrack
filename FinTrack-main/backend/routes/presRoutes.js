const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presController');

router.post('/:idUsuario/', presupuestoController.crearPresupuesto);
router.get('/:idUsuario/', presupuestoController.obtenerPresupuestos);
router.get('/:idUsuario/:idPresupuesto/', presupuestoController.obtenerPresupuestoPorId);
router.patch('/:idUsuario/:idPresupuesto/', presupuestoController.actualizarPresupuesto);
router.delete('/:idUsuario/:idPresupuesto/', presupuestoController.eliminarPresupuesto);

module.exports = router;
