const mongoose = require('mongoose');
const Usuario = require('../models/Usuarios');
const Categoria = require('../models/Categoria');

exports.crearCategoria = async (req, res) => {
  
  const idUsuario = req.params.idUsuario;
  const nuevaCategoria = req.body;

  try {
    const usuarioExiste = await Usuario.findById(idUsuario);
    if (!usuarioExiste) 
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      idUsuario,
      { $push: { categorias: nuevaCategoria } },
      { new: true }
    );

    //Ingreso al historial
    await Usuario.findByIdAndUpdate(idUsuario, {
          $push: {
            historial: {
              $each: [{
                accion: 'Creación de Categoria',
                tipo: 'categoria',
                datos_despues: nuevaCategoria
              }],
              $sort: { fecha: -1 },
              $slice: 150
            }
          }
        });

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno", detalles: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  
  const idUsuario = req.params.idUsuario;
  try {
    
    const usuario = await Usuario.findById(idUsuario);
   
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    
    res.status(200).json(usuario.categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
  }
};
  
exports.obtenerCategoriaPorId = async (req, res) => {
  
  const { idUsuario, idCategoria } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const categoria = usuario.categorias.id(idCategoria);

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.status(200).json(categoria);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la categoría', error: error.message });
  }

};

exports.actualizarCategoria = async (req, res) => {
  
  const { idUsuario, idCategoria } = req.params;
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const index = usuario.categorias.findIndex(cat => cat._id.toString() === idCategoria);

    if (index === -1) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    // Definir los datos antes de la actualizacion
    const datosAntes = {
      titulo: usuario.categorias[index].titulo,
      descripcion: usuario.categorias[index].descripcion

  }

    usuario.categorias[index].titulo = datosActualizados.titulo ?? usuario.categorias[index].titulo;
    usuario.categorias[index].descripcion = datosActualizados.descripcion ?? usuario.categorias[index].descripcion;

    await usuario.save();

   // Agregar el historial (registro de actualización)
       await Usuario.findByIdAndUpdate(idUsuario, {
         $push: {
           historial: {
             accion: 'Actualizacion de Categoria',
             tipo: 'categoria',
             datos_antes: datosAntes,
             datos_despues: usuario.categorias[index],
           },
         },
       });

    res.status(200).json({ mensaje: 'Categoría actualizada correctamente', categoria: usuario.categorias[index] });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar categoría', error: error.message });
  }
};

exports.eliminarCategoria = async (req, res) => {
   const { idUsuario, idCategoria } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const categoriaEliminada = usuario.categorias.find(
      c => c._id.toString() === idCategoria
    )

    const categoriasAntes = usuario.categorias.length;
    usuario.categorias = usuario.categorias.filter(cat => cat._id.toString() !== idCategoria);

    if (usuario.categorias.length === categoriasAntes) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    await usuario.save();

    await Usuario.findByIdAndUpdate(idUsuario, {
          $push: {
            historial: {
              accion: 'Eliminacion de Categoria',
              tipo: 'categoria',
              datos_antes: categoriaEliminada,
              datos_despues: {},
            },
          },
        });

    res.status(200).json({ mensaje: 'Categoría eliminada correctamente', Categoria: categoriaEliminada });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
  }
};