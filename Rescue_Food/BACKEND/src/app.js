const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // ✅ agregar

const app = express();

// Rutas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const tiendasRoutes = require('./routes/tiendas.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const productosRoutes = require('./routes/productos.routes');
const carritoRoutes = require('./routes/carrito.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const pagosRoutes = require('./routes/pagos.routes');
const tiendasPublicRoutes = require('./routes/tiendas.public.routes');
const adminRoutes = require('./routes/admin.routes');

// Middlewares
app.use(cors());
app.use(morgan('dev')); // ✅ logging como en la guía
app.use(express.json());

// Middleware personalizado (como te enseñaron)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, msg: 'API activa' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/tiendas', tiendasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/tiendas-public', tiendasPublicRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: 'Ruta no encontrada' });
});

// ✅ Middleware de errores global (FALTABA)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    msg: 'Error interno del servidor'
  });
});

module.exports = app;