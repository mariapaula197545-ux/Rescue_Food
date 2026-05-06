// Importa librerías
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importa modelo de auth
const AuthModel = require('../models/auth.model');

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    }
  );
};

// Devuelve tipos de cuenta
const getTiposCuenta = async (req, res) => {
  res.status(200).json({
    ok: true,
    data: [
      { codigo: 'COMPRADOR', nombre: 'Comprador' },
      { codigo: 'TIENDA', nombre: 'Tienda' }
    ]
  });
};

// Registra comprador
const registerComprador = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, email y password son obligatorios'
      });
    }

    const existingUser = await AuthModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        msg: 'Ya existe un usuario registrado con ese correo'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear comprador con contraseña encriptada
    const data = await AuthModel.createComprador({
      nombre,
      email,
      password: passwordHash
    });

    return res.status(201).json({
      ok: true,
      msg: 'Comprador registrado correctamente',
      data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// Registra tienda
const registerTienda = async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, horario, password } = req.body;

    if (!nombre || !email || !telefono || !direccion || !horario || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, email, telefono, direccion, horario y password son obligatorios'
      });
    }

    const existingUser = await AuthModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        msg: 'Ya existe un usuario registrado con ese correo'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear tienda con contraseña encriptada
    const data = await AuthModel.createTienda({
      nombre,
      email,
      telefono,
      direccion,
      horario,
      password: passwordHash
    });

    return res.status(201).json({
      ok: true,
      msg: 'Tienda registrada correctamente',
      data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// Login comprador
const loginComprador = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'email y password son obligatorios'
      });
    }

    // Buscar usuario por email
    const usuario = await AuthModel.findUserByEmail(email);

    if (!usuario || usuario.rol !== 'COMPRADOR') {
      return res.status(401).json({
        ok: false,
        msg: 'Correo o contraseña incorrectos'
      });
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        msg: 'Correo o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generarToken(usuario);

    return res.status(200).json({
      ok: true,
      msg: 'Inicio de sesión exitoso',
      token,
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        direccion: usuario.direccion,
        rol: usuario.rol
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// Login tienda
const loginTienda = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'email y password son obligatorios'
      });
    }

    // Buscar usuario por email
    const usuario = await AuthModel.findUserByEmail(email);

    if (!usuario || usuario.rol !== 'TIENDA') {
      return res.status(401).json({
        ok: false,
        msg: 'Correo o contraseña incorrectos'
      });
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        msg: 'Correo o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generarToken(usuario);

    return res.status(200).json({
      ok: true,
      msg: 'Inicio de sesión exitoso',
      token,
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        tienda: {
          id: usuario.tienda_id,
          nombre_tienda: usuario.nombre_tienda,
          telefono: usuario.telefono,
          horario: usuario.horario,
          logo_url: usuario.logo_url
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// Recuperar contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        ok: false,
        msg: 'El email es obligatorio'
      });
    }

    const user = await AuthModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario con ese correo'
      });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await AuthModel.saveRecoveryCode(user.id, code, expiresAt);

    return res.status(200).json({
      ok: true,
      msg: 'Código generado correctamente. En una versión real se enviaría al correo.',
      data: {
        email,
        codigo: code,
        expira_en: expiresAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
  try {
    const { email, codigo, nuevaPassword } = req.body;

    if (!email || !codigo || !nuevaPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'email, codigo y nuevaPassword son obligatorios'
      });
    }

    const user = await AuthModel.findUserByEmailAndCode(email, codigo);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Código inválido'
      });
    }

    if (!user.codigo_expira_en || new Date(user.codigo_expira_en) < new Date()) {
      return res.status(400).json({
        ok: false,
        msg: 'El código ya expiró'
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(nuevaPassword, salt);

    await AuthModel.updatePassword(user.id, passwordHash);

    return res.status(200).json({
      ok: true,
      msg: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// Cerrar sesión
const logout = (req, res) => {
  return res.status(200).json({
    ok: true,
    msg: 'Sesión cerrada'
  });
};

// Exporta controladores
module.exports = {
  getTiposCuenta,
  registerComprador,
  registerTienda,
  loginComprador,
  loginTienda,
  forgotPassword,
  resetPassword,
  logout
};