import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';


dotenv.config(); // Cargar variables de entorno
const SECRET_KEY = process.env.SECRET_KEY; 

function crearToken(payload) { 
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '2s' }); 
}

function verificarToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valido: true, datos: decoded };
  } catch (error) {
    return { valido: false, error: 'Código Invalido o Expirado' };
  }
}

// --------- EJEMPLO DE USO ---------

// Guardar infor del usuario
const datosUsuario = {
  id: 123,
  email: 'usuario@correo.com',
};

// Crear un token para el usuario
const token = crearToken(datosUsuario);
console.log('Token generado:', token);

// Verificar el token
setTimeout(() => {
    const resultado = verificarToken(token);
    console.log('Resultado de la verificación', resultado);
  }, 1000);
