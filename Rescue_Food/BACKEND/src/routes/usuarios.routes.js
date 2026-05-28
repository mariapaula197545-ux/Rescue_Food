// src/routes/usuarios.routes.js

const express = require('express');

const controller =
  require('../controllers/usuarios.controller');

const upload =
  require('../middlewares/uploadPerfil');

const router = express.Router();

// =====================================
// OBTENER USUARIO
// =====================================
router.get('/:id', controller.getById);

// =====================================
// ACTUALIZAR USUARIO
// =====================================
router.put(
  '/:id',
  upload.single('foto'),
  controller.updateById
);

module.exports = router;