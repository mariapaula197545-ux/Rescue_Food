const { pool } = require('../config/db');

// OBTENER USUARIO
const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
        u.id,
        u.nombre,
        u.email,
        u.direccion,
        u.foto_perfil,
        r.nombre AS rol,
        u.creado_en,
        u.actualizado_en
     FROM usuarios u
     INNER JOIN roles r
       ON r.id = u.rol_id
     WHERE u.id = ?`,
    [id]
  ); // Cruza usuarios con roles para retornar el nombre de texto del rol en lugar de solo su ID numérico

  return rows[0];
};

// VALIDAR EMAIL
const findEmailInAnotherUser = async (email, userId) => {
  const [rows] = await pool.query(
    `SELECT id
     FROM usuarios
     WHERE email = ?
     AND id <> ?`,
    [email, userId]
  ); // Omite al usuario actual mediante el operador (<>) para que no se autodetecte como duplicado

  return rows[0];
};

// ACTUALIZAR
const updateById = async (
  id,
  { nombre, email, direccion, foto_perfil }
) => {
  const [result] = await pool.query(
    `UPDATE usuarios
     SET
       nombre = COALESCE(?, nombre),
       email = COALESCE(?, email),
       direccion = COALESCE(?, direccion),
       foto_perfil = COALESCE(?, foto_perfil)
     WHERE id = ?`,
    [
      nombre ?? null,
      email ?? null,
      direccion ?? null,
      foto_perfil ?? null,
      id
    ]
  ); // Utiliza COALESCE y operadores de fusión nula para actualizar de manera parcial solo los campos enviados

  return result.affectedRows;
};

// NUEVO: OBTENER CONTRASEÑA ACTUAL (SÓLO EL HASH)
const getPasswordById = async (id) => {
  const [rows] = await pool.query(
    `SELECT password FROM usuarios WHERE id = ?`,
    [id]
  ); // Consulta únicamente el string del hash para validar la clave actual antes de un cambio
  return rows[0];
};

// NUEVO: ACTUALIZAR CONTRASEÑA EN BD
const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query(
    `UPDATE usuarios SET password = ? WHERE id = ?`,
    [hashedPassword, id]
  ); // Reemplaza el hash anterior de la contraseña por el nuevo string ya encriptado
  return result.affectedRows;
};

module.exports = {
  getById,
  findEmailInAnotherUser,
  updateById,
  getPasswordById,
  updatePassword
};