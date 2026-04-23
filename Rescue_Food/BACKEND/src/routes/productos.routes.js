// Importa express
const express = require('express');

// Importa controlador productos
const controller = require('../controllers/productos.controller');

// Crea router
const router = express.Router();

// Productos de mi tienda
router.get('/tienda/:usuarioId/mis-productos', controller.getMine);

// Crear producto
router.post('/tienda/:usuarioId', controller.create);

// Actualizar producto
router.put('/tienda/:usuarioId/:id', controller.update);

// Eliminar producto
router.delete('/tienda/:usuarioId/:id', controller.remove);

// Listar todos los productos
router.get('/', controller.getAll);

// Obtener producto por ID
router.get('/:id', controller.getById);

// Exporta rutas
module.exports = router;