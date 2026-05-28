const express = require('express');

const router = express.Router(); // Inicializa el enrutador de Express para gestionar los endpoints del catálogo

const controller = require('../controllers/productos.controller');

const {
  verificarToken
} = require('../middlewares/auth.middlewares'); // Importa el middleware de seguridad para validar el JWT

const upload = require('../middlewares/upload'); // Importa la configuración de multer para la subida de archivos

// MIS PRODUCTOS
router.get(
  '/mis-productos',
  verificarToken,
  controller.getMine
); // Protege la ruta con verificarToken para saber qué comerciante está solicitando ver sus productos

// CREAR
router.post(
  '/',
  verificarToken,
  upload.single('imagen'),
  controller.create
); // Combina seguridad (token) y carga de archivos (upload) procesando un solo archivo bajo la propiedad 'imagen'

// EDITAR
router.put(
  '/:id',
  verificarToken,
  upload.single('imagen'),
  controller.update
); // Utiliza PUT para recibir el parámetro ID por URL y actualizar los datos o la imagen del ítem

// ELIMINAR
router.delete(
  '/:id',
  verificarToken,
  controller.remove
); // Utiliza el método HTTP DELETE para remover de forma segura un producto usando su ID

// LISTAR TODOS
router.get(
  '/',
  controller.getAll
); // Ruta pública: No lleva middlewares porque cualquier visitante (invitado o cliente) puede ver el catálogo

// POR ID
router.get(
  '/:id',
  controller.getById
); // Ruta pública: Permite renderizar la ficha técnica de un producto individual a través de su ID en la URL

module.exports = router;