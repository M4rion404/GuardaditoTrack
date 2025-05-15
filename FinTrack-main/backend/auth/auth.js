const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/* 
 *
 *  FIRMAR TOKEN
 *    Crea una cadena combinando:
 *      
 *      TANTO EL IdUsuario COMO Email van contenidos en el PAYLOAD
 *      - Id del usuario (la cadena de Mongo) ---> id: usuario._id
 *      - Su correo electrónico ---> email: usuario.email
 *      
 *      - La clave secreta (La cadena Hexadecimal de 64 caracteres guardada en el .env) ---> JWT_SECRET
 *      - Un tiempo de vida de 3 minutos ---> expiresIn: '3m'
 * 
*/
function firmarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '3m' });
}

/*
     *
     *  Se puede considerar la respuesta para el Navegador. 
     * 
     *  CREAR COOKIE
     *    Se crea un archivo que el navegador utilizará para guardar 
     *    la info del usuario de manera temporal, este archivo contiene:
     *      - Nombre: token
     *      - Token firmado: token formado con el idUsuario, email y la variable del .env
     *      - Instrucciones adicionales para el comportamiento del doc como:
     *        1.- httpOnly: Evita que puedan acceder a los datos a través de JS desde el frontend (Ataques XSS)
     *        2.- secure: Indica si se esta utilizando conexión HTTPS
     *        3.- sameSite: Evita que la cookie se enviada a otros dominios, que solo funcione en el frontend (Ataques CSRF)
     *        4.- maxAge: En milisegundos establece por cuanto tiempo se le considera válida la Cookie
     *
     * 
     */

// Crear Cookie
function crearCookie (res, token){
  res.cookie('token', token, {
      httpOnly: true, 
      secure: false,        
      sameSite: 'Strict', 
      maxAge: 3 * 60 * 1000 
    });
}
    
function verificarCookie(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next(); // Continua a la ruta
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

// Verificar Cookie
function verificarCookie(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}; // VERIFICAR TOKEN

module.exports = {
  firmarToken,
  crearCookie,
  verificarCookie,
};
