// Importa express
const express = require('express');

// Importa controlador auth
const ctrl = require('../controllers/auth.controller');

// Crea router
const router = express.Router();

// Obtener tipos de cuenta
router.get('/tipos-cuenta', ctrl.getTiposCuenta);

// Registro de usuarios
router.post('/register/comprador', ctrl.registerComprador); // crear comprador
router.post('/register/tienda', ctrl.registerTienda); // crear tienda

// Login
router.post('/login/comprador', ctrl.loginComprador); // login comprador
router.post('/login/tienda', ctrl.loginTienda); // login tienda

// Recuperación de contraseña
router.post('/forgot-password', ctrl.forgotPassword); // generar código
router.post('/reset-password', ctrl.resetPassword); // cambiar contraseña

// Logout
router.post('/logout', ctrl.logout); // cerrar sesión

// Exporta rutas
module.exports = router;