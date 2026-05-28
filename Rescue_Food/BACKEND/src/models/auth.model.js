
// Importa conexión MySQL
const { pool } = require('../config/db');

// IDs de roles
const ROLE_IDS = {
  ADMIN: 1,
  COMPRADOR: 2,
  TIENDA: 3
};

// BUSCAR USUARIO POR EMAIL (CORREGIDO)
const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.password, u.direccion, u.foto_perfil, r.nombre AS rol
     FROM usuarios u
     INNER JOIN roles r ON r.id = u.rol_id
     WHERE u.email = ?`,
    [email]
  ); // Cruza la tabla usuarios con roles (INNER JOIN) para traer el nombre del rol en texto

  return rows[0]; // devuelve usuario
};

// CREAR COMPRADOR
const createComprador = async ({ nombre, email, password }) => {
  const [result] = await pool.query(
    `INSERT INTO usuarios (rol_id, nombre, email, password)
     VALUES (?, ?, ?, ?)`,
    [ROLE_IDS.COMPRADOR, nombre, email, password]
  ); // Inserta el nuevo registro asignándole directamente el ID del rol de comprador (2)

  return {
    id: result.insertId, // id generado de forma automática por la base de datos
    nombre,
    email,
    rol: 'COMPRADOR'
  };
};

// CREAR TIENDA (CON TRANSACCIÓN)
const createTienda = async ({ nombre, email, telefono, direccion, horario, password }) => {
  const connection = await pool.getConnection(); // Abre un canal único de comunicación con la base de datos

  try {
    await connection.beginTransaction(); // Inicia una transacción para asegurar que se ejecuten los dos inserts o ninguno

    const [userResult] = await connection.query(
      `INSERT INTO usuarios (rol_id, nombre, email, password, direccion)
       VALUES (?, ?, ?, ?, ?)`,
      [ROLE_IDS.TIENDA, nombre, email, password, direccion || null]
    ); // Primero crea el usuario con el rol de tienda (3)

    const usuarioId = userResult.insertId; // Toma el ID que generó el usuario anterior

    await connection.query(
      `INSERT INTO tiendas (usuario_id, nombre_tienda, telefono, direccion, horario)
       VALUES (?, ?, ?, ?, ?)`,
      [usuarioId, nombre, telefono || null, direccion || null, horario || null]
    ); // Usa ese mismo ID para enlazar y crear el perfil comercial en la tabla de tiendas

    await connection.commit(); // Todo salió bien: consolida y guarda permanentemente los cambios en la BD

    return {
      id: usuarioId,
      nombre,
      email,
      rol: 'TIENDA'
    };
  } catch (error) {
    await connection.rollback(); // Si algo falló en cualquiera de los dos inserts, deshace todo para no dejar datos huérfanos
    throw error;
  } finally {
    connection.release(); // Libera la conexión de vuelta al pool para que pueda ser reutilizada por otra petición
  }
};

// LOGIN POR ROL
const loginByRole = async (email, password, roleName) => {
  const [rows] = await pool.query(
    `SELECT
        u.id,
        u.nombre,
        u.email,
        u.direccion,
        u.foto_perfil,
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
  ); // Aplica LEFT JOIN con tiendas para que, si el usuario es un comerciante, traiga también los datos de su local

  return rows[0]; // devuelve usuario
};

// GUARDAR CÓDIGO DE RECUPERACIÓN
const saveRecoveryCode = async (userId, code, expiresAt) => {
  await pool.query(
    `UPDATE usuarios
     SET codigo_recuperacion = ?, codigo_expira_en = ?
     WHERE id = ?`,
    [code, expiresAt, userId]
  ); // Almacena temporalmente el código numérico y su hora límite de expiración
};

// BUSCAR USUARIO CON CÓDIGO
const findUserByEmailAndCode = async (email, code) => {
  const [rows] = await pool.query(
    `SELECT id, email, codigo_recuperacion, codigo_expira_en
     FROM usuarios
     WHERE email = ?
       AND codigo_recuperacion = ?`,
    [email, code]
  ); // Valida que coincidan tanto el correo del solicitante como el código enviado
  
  return rows[0];
};

// ACTUALIZAR CONTRASEÑA
const updatePassword = async (userId, newPassword) => {
  await pool.query(
    `UPDATE usuarios
     SET password = ?, codigo_recuperacion = NULL, codigo_expira_en = NULL
     WHERE id = ?`,
    [newPassword, userId]
  ); // Sobrescribe la contraseña y limpia los campos de recuperación para que el código no sirva dos veces
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