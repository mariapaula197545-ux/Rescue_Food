// src/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/auth.model');
const UsuarioModel = require('../models/usuarios.model'); // Importación necesaria para alterar credenciales

// TIPOS DE CUENTA
const getTiposCuenta = (req, res) => {
  return res.status(200).json({
    ok: true,
    data: [
      { codigo: 'COMPRADOR', nombre: 'Comprador' },
      { codigo: 'TIENDA', nombre: 'Tienda' }
    ]
  });
};

// REGISTRO COMPRADOR
const registerComprador = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación: Verifica que se reciban todos los campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Faltan datos'
      });
    }

    // Consulta si el correo ya existe en la base de datos
    const exists = await AuthModel.findUserByEmail(email);

    // Si el correo ya está registrado, retorna un error de conflicto
    if (exists) {
      return res.status(409).json({
        ok: false,
        msg: 'Correo ya registrado'
      });
    }

    // Encripta la contraseña usando bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Almacena el nuevo comprador con la contraseña encriptada
    const data = await AuthModel.createComprador({
      nombre,
      email,
      password: hash
    });

    return res.status(201).json({
      ok: true,
      msg: 'Usuario creado',
      data
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// REGISTRO TIENDA
const registerTienda = async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, horario, password } = req.body;

    // Validación: Verifica que el comercio envíe todos sus datos obligatorios
    if (!nombre || !email || !telefono || !direccion || !horario || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Faltan datos'
      });
    }

    // Consulta si el correo comercial ya existe
    const exists = await AuthModel.findUserByEmail(email);

    if (exists) {
      return res.status(409).json({
        ok: false,
        msg: 'Correo ya registrado'
      });
    }

    // Encripta la contraseña de la tienda
    const hash = await bcrypt.hash(password, 10);

    // Crea el registro de la tienda en la base de datos
    const data = await AuthModel.createTienda({
      nombre,
      email,
      telefono,
      direccion,
      horario,
      password: hash
    });

    return res.status(201).json({
      ok: true,
      msg: 'Tienda creada',
      data
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// LOGIN COMPRADOR
const loginComprador = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Faltan datos'
      });
    }

    // Busca al usuario por su correo electrónico
    const user = await AuthModel.findUserByEmail(email);

    // Valida la existencia del usuario y que corresponda al rol de COMPRADOR
    if (!user || user.rol !== 'COMPRADOR') {
      return res.status(401).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }

    // Compara la contraseña ingresada con la contraseña encriptada
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }

    // Genera el token JWT guardando el ID, email y rol
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retorna la respuesta exitosa incluyendo la foto de perfil para el frontend
    return res.status(200).json({
      ok: true,
      msg: 'Login exitoso',
      token,
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        foto_perfil: user.foto_perfil 
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// LOGIN TIENDA
const loginTienda = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Faltan datos'
      });
    }

    // Busca el usuario de la tienda por su correo electrónico
    const user = await AuthModel.findUserByEmail(email);

    // Valida la existencia del usuario y que corresponda al rol de TIENDA
    if (!user || user.rol !== 'TIENDA') {
      return res.status(401).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }

    // Compara la contraseña de la tienda con la almacenada en la base de datos
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }

    // Genera el token JWT firmado para la tienda
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retorna los datos de autenticación de la tienda junto con su foto de perfil
    return res.status(200).json({
      ok: true,
      msg: 'Login exitoso',
      token,
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        foto_perfil: user.foto_perfil 
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// LOGOUT
const logout = (req, res) => {
  return res.status(200).json({
    ok: true,
    msg: 'Sesión cerrada'
  });
};

// PASSWORD RESET (básico)
const forgotPassword = (req, res) => {
  return res.status(200).json({
    ok: true,
    msg: 'Función no implementada aún'
  });
};

const resetPassword = (req, res) => {
  return res.status(200).json({
    ok: true,
    msg: 'Función no implementada aún'
  });
};

// NUEVO: CONTROLADOR PARA CAMBIAR PASSWORD
const cambiarPassword = async (req, res) => {
  try {
    // Recupera el ID del usuario desde el objeto req que inyecta el middleware de validación del token
    const usuarioId = req.usuario.id;
    const { passwordActual, passwordNuevo } = req.body;

    // Obtiene la contraseña encriptada actual consultando por ID
    const user = await UsuarioModel.getPasswordById(usuarioId);
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    // Verifica si la contraseña actual ingresada coincide con la de la base de datos
    const validPassword = await bcrypt.compare(passwordActual, user.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, msg: 'La contraseña actual es incorrecta' });
    }

    // Encripta la nueva contraseña elegida
    const hash = await bcrypt.hash(passwordNuevo, 10);
    
    // Actualiza la contraseña encriptada en el modelo de usuario
    await UsuarioModel.updatePassword(usuarioId, hash);

    return res.status(200).json({
      ok: true,
      msg: 'Contraseña cambiada con éxito'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// EXPORTACIÓN
module.exports = {
  getTiposCuenta,
  registerComprador,
  registerTienda,
  loginComprador,
  loginTienda,
  forgotPassword,
  resetPassword,
  logout,
  cambiarPassword
};
