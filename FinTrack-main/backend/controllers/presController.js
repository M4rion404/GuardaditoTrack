const Presupuesto = require('../models/Presupuesto');
const Usuario = require('../models/Usuarios');

exports.crearPresupuesto = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const nuevoPresupuesto = req.body;

  console.log("➡️ Solicitud recibida para crear presupuesto");
  console.log("🧾 Datos recibidos:", JSON.stringify(nuevoPresupuesto, null, 2));

  try {
    const usuarioExiste = await Usuario.findById(idUsuario);

    if (!usuarioExiste) {
      console.log("⚠️ Usuario no encontrado con ID:", idUsuario);
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!Array.isArray(nuevoPresupuesto.categorias)) {
      console.log("❌ Error: categorías no es un array");
      return res.status(400).json({ mensaje: "Las categorías deben ser un arreglo válido" });
    }

    const sumaCategorias = nuevoPresupuesto.categorias.reduce((total, categoria) => {
      return total + Number(categoria.limite || 0);
    }, 0);

    console.log("✅ Suma de límites por categoría:", sumaCategorias);
    console.log("📊 Límite del presupuesto:", nuevoPresupuesto.limite);

    if (sumaCategorias > Number(nuevoPresupuesto.limite)) {
      console.log("❌ Error: suma de límites de categoría excede el límite total");
      return res.status(400).json({
        mensaje: `La suma de los límites por categoría (${sumaCategorias}) excede el límite total del presupuesto (${nuevoPresupuesto.limite}).`
      });
    }

    // Asignar dinero_disponible general y por categoría
    nuevoPresupuesto.dinero_disponible = Number(nuevoPresupuesto.limite);
    nuevoPresupuesto.categorias = nuevoPresupuesto.categorias.map(cat => ({
      ...cat,
      dinero_disponible: Number(cat.limite)
    }));

    // Agregar presupuesto al usuario
    usuarioExiste.presupuestos.push(nuevoPresupuesto);
    console.log("✅ Presupuesto agregado a usuario");

    // Registrar acción en historial (manualmente para evitar validación global)
    const historialAccion = {
      tipo: 'presupuesto',
      accion: 'crear',
      fecha: new Date(),
      datos_despues: nuevoPresupuesto
    };

    usuarioExiste.historial.push(historialAccion);
    usuarioExiste.historial.sort((a, b) => b.fecha - a.fecha);
    usuarioExiste.historial = usuarioExiste.historial.slice(0, 150);

    await usuarioExiste.save();
    console.log("📝 Historial actualizado y usuario guardado");

    res.status(200).json({
      mensaje: 'Presupuesto creado exitosamente',
      presupuesto: nuevoPresupuesto
    });

  } catch (error) {
    console.log("❗ Error en crearPresupuesto:", error);
    res.status(500).json({
      mensaje: 'Error al crear presupuesto',
      error: error.message
    });
  }
};
 // CREAR PRESUPUESTO

exports.obtenerPresupuestos = async (req, res) => {
  const idUsuario = req.params.idUsuario;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario.presupuestos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener presupuestos', error: error.message });
  }
}; // OBTENER PRESUPUESTOS

exports.obtenerPresupuestoPorId = async (req, res) => {
  const { idUsuario, idPresupuesto } = req.params;

  try {
    // Buscar el usuario
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Buscar el presupuesto dentro del arreglo de presupuestos
    const presupuesto = usuario.presupuestos.find(p => p._id.toString() === idPresupuesto);

    if (!presupuesto) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    res.status(200).json(presupuesto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar presupuesto', error: error.message });
  }
};
 // OBTENER PRESUPUESTO

exports.actualizarPresupuesto = async (req, res) => {
  const { idUsuario, idPresupuesto } = req.params;
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const index = usuario.presupuestos.findIndex(p => p._id.toString() === idPresupuesto);
    if (index === -1) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    const datosAntes = {
      titulo: usuario.presupuestos[index].titulo,
      descripcion: usuario.presupuestos[index].descripcion,
      limite: usuario.presupuestos[index].limite,
      dinero_disponible: usuario.presupuestos[index].dinero_disponible,
      periodo: usuario.presupuestos[index].periodo,
      fecha_creacion: usuario.presupuestos[index].fecha_creacion,
      categorias: usuario.presupuestos[index].categorias,
    };

    usuario.presupuestos[index].titulo = datosActualizados.titulo ?? usuario.presupuestos[index].titulo;
    usuario.presupuestos[index].descripcion = datosActualizados.descripcion ?? usuario.presupuestos[index].descripcion;
    usuario.presupuestos[index].limite = datosActualizados.limite ?? usuario.presupuestos[index].limite;
    usuario.presupuestos[index].dinero_disponible = datosActualizados.dinero_disponible ?? usuario.presupuestos[index].dinero_disponible;
    usuario.presupuestos[index].periodo = datosActualizados.periodo ?? usuario.presupuestos[index].periodo;
    usuario.presupuestos[index].fecha_creacion = datosActualizados.fecha_creacion ?? usuario.presupuestos[index].fecha_creacion;
    usuario.presupuestos[index].categorias = datosActualizados.categorias ?? usuario.presupuestos[index].categorias;

    // Limpiar historial para evitar errores de validación
    usuario.historial = usuario.historial.filter(item =>
      item.tipo &&
      ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'].includes(item.tipo)
    );

    // Agregar entrada al historial
    usuario.historial.push({
      accion: 'Actualización de Presupuesto',
      tipo: 'presupuesto',
      datos_antes: datosAntes,
      datos_despues: usuario.presupuestos[index],
      fecha: new Date()
    });

    // Limitar historial a los últimos 150
    usuario.historial = usuario.historial
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    await usuario.save();

    res.status(200).json({
      mensaje: 'Presupuesto actualizado correctamente',
      presupuesto: usuario.presupuestos[index]
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar presupuesto',
      error: error.message
    });
  }
}; // ACTUALIZAR PRESUPUESTO

exports.eliminarPresupuesto = async (req, res) => {
  
  const { idUsuario, idPresupuesto } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Buscar el presupuesto antes de eliminarlo
    const presupuestoEliminado = usuario.presupuestos.find(
      p => p._id.toString() === idPresupuesto
    );

    const presupuestosAntes = usuario.presupuestos.length;
    usuario.presupuestos = usuario.presupuestos.filter(
      p => p._id.toString() !== idPresupuesto
    );

    if (usuario.presupuestos.length === presupuestosAntes) {
      return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    }

    // Limpiar historial para evitar errores de validación
    usuario.historial = usuario.historial.filter(item =>
      item.tipo &&
      ['presupuesto', 'transaccion', 'categoria', 'meta_ahorro'].includes(item.tipo)
    );

    // Agregar entrada al historial
    usuario.historial.push({
      accion: 'Eliminacion de Presupuesto',
      tipo: 'presupuesto',
      datos_antes: presupuestoEliminado,
      datos_despues: {},
      fecha: new Date()
    });

    // Ordenar historial por fecha descendente y limitar a los últimos 150
    usuario.historial = usuario.historial
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 150);

    // Guardar cambios en usuario
    await usuario.save();

    res.status(200).json({
      mensaje: 'Presupuesto eliminado correctamente',
      presupuesto_eliminado: presupuestoEliminado
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar presupuesto',
      error: error.message
    });
  }
};// ELIMINAR PRESUPUESTO
