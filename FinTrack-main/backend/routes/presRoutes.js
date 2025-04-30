const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presController');

router.post('/', presupuestoController.crearPresupuesto);
router.get('/', presupuestoController.obtenerPresupuestos);
router.get('/:id', presupuestoController.obtenerPresupuestoPorId);
router.put('/:id', presupuestoController.actualizarPresupuesto);
router.delete('/:id', presupuestoController.eliminarPresupuesto);

module.exports = router;
