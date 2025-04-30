/* const express = require('express');
const conectarDB = require('./config/db');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const gastoRoutes = require('./routes/gastosRoute');  // Importar las rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const transaccionRoutes = require('./routes/transRoutes');

// Crear la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
conectarDB();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
conectarDB()
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.log('Error de conexión:', err);
  });

// Usar las rutas para manejar las solicitudes
app.use(gastoRoutes);
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/transacciones', require('./routes/transRoutes'));
app.use('/api/presupuestos', require('./routes/presRoutes'));
app.use('/api/movimientos', require('./routes/movRoutes'));
app.use('/api/categorias', require('./routes/catRoutes'));
app.use('/api/divisas', require('./routes/divRoutes.js'));


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); */

//____________________________________________________________________________________________________________________

const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const gastoRoutes = require('./routes/gastosRoute');  // Importar las rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const transaccionRoutes = require('./routes/transRoutes');
const presRoute = require('./routes/presRoutes');
const movRoute = require('./routes/movRoutes');
const catRoute = require('./routes/catRoutes');
const divRoute = require('./routes/divRoutes');

// Crear la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Middleware para manejar JSON en las solicitudes

// Conexión a MongoDB
conectarDB()
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.log('Error de conexión:', err);
  });

// Usar las rutas para manejar las solicitudes
app.use('/api/gastos', gastoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/presupuestos', presRoute);
app.use('/api/movimientos', movRoute);
app.use('/api/categorias', catRoute);
app.use('/api/divisas', divRoute);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


//______________________________________________________________________________________________________________________


/* // backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Cargar los datos aleatorios
const generarDatos = require('./GenerarDataRandom');

app.use(cors());

// Ruta que envía los datos al frontend
app.get('/api/datos', (req, res) => {
  const nuevosDatos = require('./GenerarDataRandom'); // recarga con nuevos datos en cada request
  res.json(nuevosDatos);
});

app.listen(3000, () => {
  console.log('✅ Servidor backend en http://localhost:3000');
}); */

/* const express = require('express');
const connectDB = require('./db'); // Tu conexión a MongoDB
const usuarioRoutes = require('./routes/usuarioRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api', usuarioRoutes); // Ejemplo: POST a /api/usuarios

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); */

/* // backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Cargar los datos aleatorios
const generarDatos = require('./GenerarDataRandom');

// Configurar CORS para permitir solicitudes desde el frontend en puerto 3001
app.use(cors({
  origin: 'http://localhost:3001', // Permite solicitudes desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

// Ruta que envía los datos al frontend
app.get('/api/datos', (req, res) => {
  const nuevosDatos = require('./GenerarDataRandom'); // Recarga con nuevos datos en cada request
  res.json(nuevosDatos);
});

app.listen(3000, () => {
  console.log('✅ Servidor backend en http://localhost:3000');
}); */
