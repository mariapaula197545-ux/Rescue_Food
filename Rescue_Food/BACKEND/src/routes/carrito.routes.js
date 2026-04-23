// Importa express
const express = require('express');

// Importa controlador carrito
const controller = require('../controllers/carrito.controller');

// Crea router
const router = express.Router();

// Obtener carrito del usuario
router.get('/:usuarioId', controller.getCart);

// Agregar producto al carrito
router.post('/:usuarioId/items', controller.addItem);

// Actualizar cantidad de producto
router.put('/:usuarioId/items/:productoId', controller.updateItem);

// Eliminar producto del carrito
router.delete('/:usuarioId/items/:productoId', controller.removeItem);

// Vaciar carrito completo
router.delete('/:usuarioId', controller.clearCart);

// Exporta rutas
module.exports = router;