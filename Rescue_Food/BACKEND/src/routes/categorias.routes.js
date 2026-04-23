// Importa express
const express = require('express');

// Importa controlador categorías
const controller = require('../controllers/categorias.controller');

// Crea router
const router = express.Router();

// Obtener todas las categorías
router.get('/', controller.getAll);

// Obtener categoría por ID
router.get('/:id', controller.getById);

// Exporta rutas
module.exports = router;