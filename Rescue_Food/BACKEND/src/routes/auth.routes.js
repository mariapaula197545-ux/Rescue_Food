// src/routes/auth.routes.js

const express = require('express');
const router = express.Router(); // Inicializa el enrutador de Express para agrupar los endpoints de autenticación

const ctrl = require('../controllers/auth.controller');

// IMPORTAMOS TU MIDDLEWARE REAL
const { verificarToken } = require('../middlewares/auth.middlewares'); 

// TIPOS DE CUENTA
router.get('/tipos-cuenta', ctrl.getTiposCuenta);

// REGISTRO
router.post('/register/comprador', ctrl.registerComprador);
router.post('/register/tienda', ctrl.registerTienda); // Define rutas POST porque el cliente envía credenciales sensibles en el cuerpo (body)

// LOGIN
router.post('/login/comprador', ctrl.loginComprador);
router.post('/login/tienda', ctrl.loginTienda);

// RECUPERACIÓN
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

// LOGOUT
router.post('/logout', ctrl.logout);

// NUEVA RUTA PROTEGIDA DE SEGURIDAD (Usando tu verificarToken)
router.put('/cambiar-password', verificarToken, ctrl.cambiarPassword); // Inyecta verificarToken como filtro obligatorio antes de ejecutar la actualización

module.exports = router;