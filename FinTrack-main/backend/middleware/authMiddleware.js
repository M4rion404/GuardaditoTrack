const Usuario = require('../models/Usuarios');
const { verificarToken } = require('../auth/auth');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    console.log("Token no proporcionado en la cabecera de autorización");
    return res.status(403).json({ mensaje: 'Token requerido' });
  }


  const token = authHeader.split(' ')[1];
  console.log("Token recibido:", token);


  const resultado = verificarToken(token);
  console.log("Resultado de verificarToken:", resultado);


  if (!resultado.valido) {
    return res.status(401).json({ mensaje: resultado.error });
  }


  Usuario.findById(resultado.datos.id)
    .then(usuario => {
      if (!usuario) {
        console.log("Usuario no encontrado con el ID:", resultado.datos.id);
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }


      // ✅ Asignamos solo el ID como esperas en los controladores
      req.usuario = { id: usuario._id };


      console.log("Usuario autenticado:", usuario.email);
      next();
    })
    .catch(err => {
      console.error("Error al buscar el usuario:", err.message);
      res.status(500).json({ mensaje: 'Error al buscar usuario', detalles: err.message });
    });
}


module.exports = authMiddleware;
