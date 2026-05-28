// Importa conexión DB
const { pool } = require('../config/db');

// Obtener todas las categorías
const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, creada_en
     FROM categorias
     ORDER BY nombre ASC`
  ); // Trae los campos específicos de la tabla organizados alfabéticamente (ASC)

  return rows; // devuelve lista
};

// Obtener categoría por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, creada_en
     FROM categorias
     WHERE id = ?`,
    [id]
  ); // Usa marcadores de posición (?) para prevenir inyecciones SQL maliciosas

  return rows[0]; // Retorna únicamente el objeto del registro encontrado
};

// Exporta funciones
module.exports = {
  getAll,
  getById
};