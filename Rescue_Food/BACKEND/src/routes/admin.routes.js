// Importa express
const express = require('express');

// Importa controlador admin
const ctrl = require('../controllers/admin.controller');

// Crea router
const router = express.Router();

// Endpoint: obtener usuarios
router.get('/usuarios', ctrl.getUsuarios);

// Endpoint: obtener pedidos
router.get('/pedidos', ctrl.getPedidos);

// Endpoint: obtener métricas
router.get('/metricas', ctrl.getMetricas);

// Exporta rutas
module.exports = router;