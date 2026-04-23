// Importa conexión DB
const { pool } = require('../config/db');

// Obtener tienda por usuario
const getByUsuarioId = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT
        t.id,
        t.usuario_id,
        u.nombre,
        u.email,
        t.nombre_tienda,
        t.telefono,
        t.direccion,
        t.horario,
        t.logo_url,
        t.creada_en,
        t.actualizada_en
     FROM tiendas t
     INNER JOIN usuarios u ON u.id = t.usuario_id
     WHERE t.usuario_id = ?`,
    [usuarioId]
  ); // consulta tienda

  return rows[0]; // devuelve una
};

// Validar email en otro usuario
const emailExistsInAnotherUser = async (email, usuarioId) => {
  const [rows] = await pool.query(
    `SELECT id FROM usuarios WHERE email = ? AND id <> ?`,
    [email, usuarioId]
  ); // busca email repetido

  return rows[0];
};

// Actualizar tienda por usuario
const updateByUsuarioId = async (usuarioId, data) => {
  const connection = await pool.getConnection(); // toma conexión

  try {
    await connection.beginTransaction(); // inicia transacción

    await connection.query(
      `UPDATE usuarios
       SET nombre = COALESCE(?, nombre),
           email = COALESCE(?, email)
       WHERE id = ?`,
      [data.nombre ?? null, data.email ?? null, usuarioId]
    ); // actualiza usuario

    const [result] = await connection.query(
      `UPDATE tiendas
       SET nombre_tienda = COALESCE(?, nombre_tienda),
           telefono = COALESCE(?, telefono),
           direccion = COALESCE(?, direccion),
           horario = COALESCE(?, horario),
           logo_url = COALESCE(?, logo_url)
       WHERE usuario_id = ?`,
      [
        data.nombre_tienda ?? null,
        data.telefono ?? null,
        data.direccion ?? null,
        data.horario ?? null,
        data.logo_url ?? null,
        usuarioId
      ]
    ); // actualiza tienda

    await connection.commit(); // guarda cambios
    return result.affectedRows;
  } catch (error) {
    await connection.rollback(); // revierte si falla
    throw error;
  } finally {
    connection.release(); // libera conexión
  }
};

// Exporta funciones
module.exports = {
  getByUsuarioId,
  emailExistsInAnotherUser,
  updateByUsuarioId
};