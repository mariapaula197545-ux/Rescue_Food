// Importa express
const express = require('express');

// Importa controlador pagos
const controller = require('../controllers/pagos.controller');

// Crea router
const router = express.Router();

// Crear pago
router.post('/', controller.createPago);

// Obtener pago por pedido
router.get('/pedido/:pedidoId', controller.getPagoByPedido);

// Exporta rutas
module.exports = router;