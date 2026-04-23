// Importa conexión DB
const { pool } = require('../config/db');

// Listar todas las tiendas
const getAll = async () => {
  const [rows] = await pool.query(`
    SELECT id, nombre_tienda, direccion, telefono, horario
    FROM tiendas
    ORDER BY id DESC
  `); // consulta tiendas

  return rows; // devuelve lista
};

// Obtener tienda por ID
const getById = async (id) => {
  const [rows] = await pool.query(`
    SELECT id, nombre_tienda, direccion, telefono, horario
    FROM tiendas
    WHERE id = ?
  `, [id]); // busca tienda

  return rows[0]; // devuelve una
};

// Obtener productos de una tienda
const getProductosByTienda = async (tiendaId) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id
    WHERE p.tienda_id = ?
  `, [tiendaId]); // consulta productos

  return rows; // devuelve lista
};

// Exporta funciones
module.exports = { getAll, getById, getProductosByTienda };