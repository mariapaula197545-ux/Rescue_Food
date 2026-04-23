// Importa express
const express = require('express');

// Importa controlador tiendas públicas
const ctrl = require('../controllers/tiendas.public.controller');

// Crea router
const router = express.Router();

// Listar todas las tiendas
router.get('/', ctrl.getAll);

// Obtener tienda por ID
router.get('/:id', ctrl.getById);

// Obtener productos de una tienda
router.get('/:id/productos', ctrl.getProductos);

// Exporta rutas
module.exports = router;