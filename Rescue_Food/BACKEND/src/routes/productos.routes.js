// Importa express
const express = require('express');

// Importa controlador productos
const controller = require('../controllers/productos.controller');

//Importa el middleware
const { verificarToken } = require('../middlewares/auth.middlewares');

// Crea router
const router = express.Router();

// 🔐 Productos de mi tienda (PROTEGIDA)
router.get('/tienda/:usuarioId/mis-productos', verificarToken, controller.getMine);

// 🔐 Crear producto (PROTEGIDA)
router.post('/tienda/:usuarioId', verificarToken, controller.create);

// 🔐 Actualizar producto (PROTEGIDA)
router.put('/tienda/:usuarioId/:id', verificarToken, controller.update);

// 🔐 Eliminar producto (PROTEGIDA)
router.delete('/tienda/:usuarioId/:id', verificarToken, controller.remove);

// 🔓 Listar todos los productos (PÚBLICA)
router.get('/', controller.getAll);

// 🔓 Obtener producto por ID (PÚBLICA)
router.get('/:id', controller.getById);

// Exporta rutas
module.exports = router;