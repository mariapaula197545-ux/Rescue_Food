// Importa express
const express = require('express');

// Importa controlador tiendas (privadas)
const controller = require('../controllers/tiendas.controller');

// Crea router
const router = express.Router();

// Obtener tienda del usuario
router.get('/usuario/:usuarioId', controller.getByUsuarioId);

// Actualizar tienda del usuario
router.put('/usuario/:usuarioId', controller.updateByUsuarioId);

// Exporta rutas
module.exports = router;