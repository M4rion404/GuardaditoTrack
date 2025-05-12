const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/catController');

router.get('/:idUsuario/', categoriaController.obtenerCategorias);
router.get('/:idUsuario/:idCategoria/', categoriaController.obtenerCategoriaPorId);

router.post('/:idUsuario/', categoriaController.crearCategoria);
router.put('/:idUsuario/:idCategoria/', categoriaController.actualizarCategoria);
router.delete('/:idUsuario/:idCategoria/', categoriaController.eliminarCategoria);


/* >>>>>>>>>>>>>>> RUTAS ADMIN <<<<<<<<<<<<<<< */
router.get('/Admin/:idUsuario/', categoriaController.obtenerCategorias);
router.get('/Admin/:idUsuario/:idCategoria/', categoriaController.obtenerCategoriaPorId);

router.post('/Admin/:idUsuario/', categoriaController.crearCategoria);
router.put('/Admin/:idUsuario/:idCategoria/', categoriaController.actualizarCategoria);
router.delete('/Admin/:idUsuario/:idCategoria/', categoriaController.eliminarCategoria);

module.exports = router;