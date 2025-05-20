const express = require('express');
const router = express.Router();
const Historial = require('../models/Historial');
const Usuario = require('../models/Usuarios');

// Ruta GET completa: http://localhost:3000/api/historial/:idUsuario?tipo=transaccion
router.get("/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;
  const { tipo } = req.query;

  try {
    const usuario = await Usuario.findById(idUsuario);
    console.log("Usuario encontrado:", usuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!usuario.historial) {
      console.log("El usuario no tiene historial.");
      return res.status(200).json([]);
    }

    let historial = [...usuario.historial];

    if (tipo && tipo !== "todos") {
      historial = historial.filter(item => item.tipo === tipo);
    }

    const historialOrdenado = historial.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    res.status(200).json(historialOrdenado);
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

module.exports = router;
