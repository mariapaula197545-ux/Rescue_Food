// Importa conexión DB
const { pool } = require('../config/db');

// Obtener todas las categorías
const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, creada_en
     FROM categorias
     ORDER BY nombre ASC`
  ); // consulta DB ordenada
  return rows; // devuelve lista
};

// Obtener categoría por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, creada_en
     FROM categorias
     WHERE id = ?`,
    [id]
  ); // busca por id

  return rows[0]; // devuelve una
};

// Exporta funciones
module.exports = {
  getAll,
  getById
};