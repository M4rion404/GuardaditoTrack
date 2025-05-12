const mongoose = require('mongoose');
const Usuario = require('../models/Usuarios');
const Categoria = require('../models/Categoria');

exports.crearCategoria = async (req, res) => {
  
  const idUsuario = req.params.idUsuario;
  const nuevaCategoria = req.body;

  try {
    const usuarioExiste = await Usuario.findById(idUsuario);
    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      idUsuario,
      { $push: { Categorias: nuevaCategoria } },
      { new: true }
    );
    res.status(200).json(usuarioActualizado);
    
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno", detalles: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  
  const idUsuario = req.params.idUsuario;
  try {
    
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario.Categorias);
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

    const categoria = usuario.Categorias.id(idCategoria);

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

    const index = usuario.Categorias.findIndex(cat => cat._id.toString() === idCategoria);

    if (index === -1) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    usuario.Categorias[index].Titulo = datosActualizados.Titulo ?? usuario.Categorias[index].Titulo;
    usuario.Categorias[index].Descripcion = datosActualizados.Descripcion ?? usuario.Categorias[index].Descripcion;

    await usuario.save();

    res.status(200).json({ mensaje: 'Categoría actualizada correctamente', categoria: usuario.Categorias[index] });

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

    const categoriasAntes = usuario.Categorias.length;
    usuario.Categorias = usuario.Categorias.filter(cat => cat._id.toString() !== idCategoria);

    if (usuario.Categorias.length === categoriasAntes) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    await usuario.save();
    res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
  }
};
