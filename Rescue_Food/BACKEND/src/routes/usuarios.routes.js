// Importa express
const express = require('express');

// Importa controlador usuarios
const controller = require('../controllers/usuarios.controller');

// Crea router
const router = express.Router();

// Obtener usuario por ID
router.get('/:id', controller.getById);

// Actualizar usuario
router.put('/:id', controller.updateById);

// Exporta rutas
module.exports = router;