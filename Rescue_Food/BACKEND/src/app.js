// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

// 1. IMPORTAR LAS RUTAS DE LA TIENDA (AQUÍ LO AGREGAMOS)
const tiendasRoutes = require('./routes/tiendas.routes'); 

const app = express();

// MIDDLEWARES
app.use(cors()); // Permite que el backend reciba peticiones seguras desde servidores externos o el localhost del Frontend
app.use(express.json()); // Middleware para que el servidor entienda y parsee los datos enviados en formato JSON dentro del body

// CARPETA IMAGENES
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
); // Hace que la carpeta 'uploads' sea pública y accesible mediante URL en el navegador para servir fotos y logos

// RUTAS AUTH
app.use(
  '/api/auth',
  authRoutes
);

// RUTAS PRODUCTOS
app.use(
  '/api/productos',
  productosRoutes
);

// RUTAS USUARIOS
app.use(
  '/api/usuarios',
  usuariosRoutes
);

// RUTAS TIENDAS (AQUÍ REGISTRAMOS EL PREFIJO PARA TU FRONTEND)
app.use(
  '/api/tiendas',
  tiendasRoutes
); // Enlaza el enrutador de tiendas asignándole un prefijo de ruta limpio para la API REST

// EXPORTAR APP
module.exports = app; // Exporta la instancia configurada de Express para que el archivo del servidor de entrada (como server.js o index.js) la ponga a escuchar