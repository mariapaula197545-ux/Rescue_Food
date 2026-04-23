// Importa express
const express = require('express');

// Importa controlador pedidos
const controller = require('../controllers/pedidos.controller');

// Crea router
const router = express.Router();

// Crear pedido (desde carrito)
router.post('/:usuarioId', controller.createPedido);

// Listar pedidos del usuario
router.get('/:usuarioId', controller.getPedidosByUsuario);

// Obtener pedido específico
router.get('/:usuarioId/:pedidoId', controller.getPedidoById);

// Actualizar estado del pedido
router.put('/:pedidoId/estado', controller.updateEstado);

// Exporta rutas
module.exports = router;