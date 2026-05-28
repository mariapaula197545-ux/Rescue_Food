// Importa express
const express = require('express');

// Importa controlador tiendas (privadas)
const controller = require('../controllers/tiendas.controller');

// Importa el middleware de multer para el logo
const upload = require('../middlewares/uploadPerfil'); // O el que uses para logos

// Crea router
const router = express.Router();

// Obtener tienda del usuario
router.get('/usuario/:usuario_id', controller.getByUsuarioId);

// Actualizar tienda del usuario (AQUÍ AGREGAMOS EL MULTER)
router.put('/usuario/:usuario_id', upload.single('logo'), controller.updateByUsuarioId);

// Exporta rutas
module.exports = router;