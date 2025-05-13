/* const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const transaccionController = require('../controllers/transController');
const Transaccion = require('../models/Transaccion');


// Rutas CRUD para transacciones
router.post('/', transaccionController.crearTransaccion);


// Obtener todas las transacciones
router.get('/', async (req, res) => {
    try {
        const transacciones = await Transaccion.find();  // No usas populate
        res.json(transacciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener transacciones', detalles: err.message });
    }
});


// Obtener una sola transacción por ID (sin populate)
router.get('/:id', async (req, res) => {
    try {
        //Busca la transacción por ID
        const transaccion = await Transaccion.findById(req.params.id);
        if (!transaccion) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json(transaccion);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener transacción', detalles: err.message });
    }
}
);


// Actualizar una transacción
router.put('/:id', transaccionController.actualizarTransaccion);


// Eliminar una transacción por ID
router.delete('/:id', transaccionController.eliminarTransaccion);


module.exports = router;
 */


const express = require('express');
const router = express.Router();
const transController = require('../controllers/transController');


router.get('/:idUsuario/', transController.obtenerTransacciones);
router.get('/:idUsuario/transacciones/:idTransaccion/', transController.obtenerTransaccionPorId);


router.post('/:idUsuario/', transController.crearTransaccion);
router.put('/:idUsuario/transacciones/:idTransaccion/', transController.actualizarTransaccion);
router.delete('/:idUsuario/transacciones/:idTransaccion/', transController.eliminarTransaccion);


module.exports = router;