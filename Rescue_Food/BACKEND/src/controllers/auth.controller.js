// Importa modelo de auth
const AuthModel = require('../models/auth.model');

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
    const { nombre, email, password } = req.body; // datos del body

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, email y password son obligatorios'
      });
    }

    const existingUser = await AuthModel.findUserByEmail(email); // busca correo
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        msg: 'Ya existe un usuario registrado con ese correo'
      });
    }

    const data = await AuthModel.createComprador({ nombre, email, password }); // crea usuario
    return res.status(201).json({
      ok: true,
      msg: 'Comprador registrado correctamente',
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Registra tienda
const registerTienda = async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, horario, password } = req.body; // datos body

    if (!nombre || !email || !telefono || !direccion || !horario || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, email, telefono, direccion, horario y password son obligatorios'
      });
    }

    const existingUser = await AuthModel.findUserByEmail(email); // valida correo
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        msg: 'Ya existe un usuario registrado con ese correo'
      });
    }

    const data = await AuthModel.createTienda({
      nombre,
      email,
      telefono,
      direccion,
      horario,
      password
    }); // crea tienda

    return res.status(201).json({
      ok: true,
      msg: 'Tienda registrada correctamente',
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Login comprador
const loginComprador = async (req, res) => {
  try {
    const { email, password } = req.body; // credenciales

    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'email y password son obligatorios' });
    }

    const data = await AuthModel.loginByRole(email, password, 'COMPRADOR'); // valida login
    if (!data) {
      return res.status(401).json({ ok: false, msg: 'Correo o contraseña incorrectos' });
    }

    return res.status(200).json({
      ok: true,
      msg: 'Inicio de sesión exitoso',
      data: {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        direccion: data.direccion,
        rol: data.rol
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Login tienda
const loginTienda = async (req, res) => {
  try {
    const { email, password } = req.body; // credenciales

    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'email y password son obligatorios' });
    }

    const data = await AuthModel.loginByRole(email, password, 'TIENDA'); // valida login
    if (!data) {
      return res.status(401).json({ ok: false, msg: 'Correo o contraseña incorrectos' });
    }

    return res.status(200).json({
      ok: true,
      msg: 'Inicio de sesión exitoso',
      data: {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        tienda: {
          id: data.tienda_id,
          nombre_tienda: data.nombre_tienda,
          telefono: data.telefono,
          horario: data.horario,
          logo_url: data.logo_url
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Recuperar contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // toma email

    if (!email) {
      return res.status(400).json({ ok: false, msg: 'El email es obligatorio' });
    }

    const user = await AuthModel.findUserByEmail(email); // busca usuario
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'No existe un usuario con ese correo' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000)); // genera código
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // vence en 15 min

    await AuthModel.saveRecoveryCode(user.id, code, expiresAt); // guarda código

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
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
  try {
    const { email, codigo, nuevaPassword } = req.body; // datos recovery

    if (!email || !codigo || !nuevaPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'email, codigo y nuevaPassword son obligatorios'
      });
    }

    const user = await AuthModel.findUserByEmailAndCode(email, codigo); // valida código
    if (!user) {
      return res.status(400).json({ ok: false, msg: 'Código inválido' });
    }

    if (!user.codigo_expira_en || new Date(user.codigo_expira_en) < new Date()) {
      return res.status(400).json({ ok: false, msg: 'El código ya expiró' });
    }

    await AuthModel.updatePassword(user.id, nuevaPassword); // cambia password

    return res.status(200).json({
      ok: true,
      msg: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
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