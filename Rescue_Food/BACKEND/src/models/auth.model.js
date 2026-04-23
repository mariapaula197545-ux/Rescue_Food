// Importa conexión MySQL
const { pool } = require('../config/db');

// IDs de roles
const ROLE_IDS = {
  ADMIN: 1,
  COMPRADOR: 2,
  TIENDA: 3
};

// Buscar usuario por email
const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.password, u.direccion, r.nombre AS rol
     FROM usuarios u
     INNER JOIN roles r ON r.id = u.rol_id
     WHERE u.email = ?`,
    [email]
  ); // consulta DB

  return rows[0]; // devuelve usuario
};

// Crear comprador
const createComprador = async ({ nombre, email, password }) => {
  const [result] = await pool.query(
    `INSERT INTO usuarios (rol_id, nombre, email, password)
     VALUES (?, ?, ?, ?)`,
    [ROLE_IDS.COMPRADOR, nombre, email, password]
  ); // inserta usuario

  return {
    id: result.insertId, // id generado
    nombre,
    email,
    rol: 'COMPRADOR'
  };
};

// Crear tienda (con transacción)
const createTienda = async ({ nombre, email, telefono, direccion, horario, password }) => {
  const connection = await pool.getConnection(); // toma conexión

  try {
    await connection.beginTransaction(); // inicia transacción

    const [userResult] = await connection.query(
      `INSERT INTO usuarios (rol_id, nombre, email, password, direccion)
       VALUES (?, ?, ?, ?, ?)`,
      [ROLE_IDS.TIENDA, nombre, email, password, direccion || null]
    ); // crea usuario

    const usuarioId = userResult.insertId; // id usuario

    await connection.query(
      `INSERT INTO tiendas (usuario_id, nombre_tienda, telefono, direccion, horario)
       VALUES (?, ?, ?, ?, ?)`,
      [usuarioId, nombre, telefono || null, direccion || null, horario || null]
    ); // crea tienda

    await connection.commit(); // guarda cambios

    return {
      id: usuarioId,
      nombre,
      email,
      rol: 'TIENDA'
    };
  } catch (error) {
    await connection.rollback(); // revierte si falla
    throw error;
  } finally {
    connection.release(); // libera conexión
  }
};

// Login por rol
const loginByRole = async (email, password, roleName) => {
  const [rows] = await pool.query(
    `SELECT
        u.id,
        u.nombre,
        u.email,
        u.direccion,
        r.nombre AS rol,
        t.id AS tienda_id,
        t.nombre_tienda,
        t.telefono,
        t.horario,
        t.logo_url
     FROM usuarios u
     INNER JOIN roles r ON r.id = u.rol_id
     LEFT JOIN tiendas t ON t.usuario_id = u.id
     WHERE u.email = ?
       AND u.password = ?
       AND r.nombre = ?`,
    [email, password, roleName]
  ); // valida login

  return rows[0]; // devuelve usuario
};

// Guardar código de recuperación
const saveRecoveryCode = async (userId, code, expiresAt) => {
  await pool.query(
    `UPDATE usuarios
     SET codigo_recuperacion = ?, codigo_expira_en = ?
     WHERE id = ?`,
    [code, expiresAt, userId]
  ); // guarda código
};

// Buscar usuario con código
const findUserByEmailAndCode = async (email, code) => {
  const [rows] = await pool.query(
    `SELECT id, email, codigo_recuperacion, codigo_expira_en
     FROM usuarios
     WHERE email = ?
       AND codigo_recuperacion = ?`,
    [email, code]
  ); // valida código

  return rows[0];
};

// Actualizar contraseña
const updatePassword = async (userId, newPassword) => {
  await pool.query(
    `UPDATE usuarios
     SET password = ?, codigo_recuperacion = NULL, codigo_expira_en = NULL
     WHERE id = ?`,
    [newPassword, userId]
  ); // cambia password
};

// Exporta funciones
module.exports = {
  ROLE_IDS,
  findUserByEmail,
  createComprador,
  createTienda,
  loginByRole,
  saveRecoveryCode,
  findUserByEmailAndCode,
  updatePassword
};