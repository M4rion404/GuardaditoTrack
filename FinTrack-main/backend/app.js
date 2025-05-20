/* Importar Módulos necesarios */
require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

/* Importar rutas */
const usuarioRoutes = require('./routes/usuarioRoutes');
const transaccionRoutes = require('./routes/transRoutes');
const presRoute = require('./routes/presRoutes');
const catRoute = require('./routes/catRoutes');
const divRoute = require('./routes/divRoutes');
const historialRoutes = require('./routes/historialRoutes');
const metasAhorroRoute = require('./routes/metaAhorroRoutes');

/* Crear la aplicación de Express */ 
const app = express();
const PORT = process.env.PORT || 3000;

/* Middlewares */
app.use(cors({ origin: 'http://localhost:3001', credentials: true })); // Configurar CORS para aceptar Cookies cruzadas desde el frontend 
app.use(cookieParser()); // Manejador de Cookies 
app.use(bodyParser.json());  // Manejador de JSON en las solicitudes

/* Conexión a MongoDB */
conectarDB()
  .then( () => { console.log('Conectado a MongoDB'); } )
  .catch( (err) => { console.log('Error de conexión:', err);} );

/* Aplicar las rutas */
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/presupuestos', presRoute);
app.use('/api/categorias', catRoute);
app.use('/api/metas-ahorro', metasAhorroRoute);
app.use('/api/historial', historialRoutes);


/* Iniciar el servidor */
app.listen(PORT, () => { console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);});