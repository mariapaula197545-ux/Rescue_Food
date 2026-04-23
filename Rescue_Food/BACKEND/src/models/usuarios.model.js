// Importa conexión DB
const { pool } = require('../config/db');

// Obtener usuario por ID
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
     INNER JOIN roles r ON r.id = u.rol_id
     WHERE u.id = ?`,
    [id]
  ); // consulta usuario

  return rows[0]; // devuelve uno
};

// Validar email en otro usuario
const findEmailInAnotherUser = async (email, userId) => {
  const [rows] = await pool.query(
    `SELECT id FROM usuarios WHERE email = ? AND id <> ?`,
    [email, userId]
  ); // busca email repetido

  return rows[0];
};

// Actualizar usuario
const updateById = async (id, { nombre, email, direccion, foto_perfil }) => {
  const [result] = await pool.query(
    `UPDATE usuarios
     SET nombre = COALESCE(?, nombre),
         email = COALESCE(?, email),
         direccion = COALESCE(?, direccion),
         foto_perfil = COALESCE(?, foto_perfil)
     WHERE id = ?`,
    [nombre ?? null, email ?? null, direccion ?? null, foto_perfil ?? null, id]
  ); // update parcial

  return result.affectedRows; // filas afectadas
};

// Exporta funciones
module.exports = {
  getById,
  findEmailInAnotherUser,
  updateById
};