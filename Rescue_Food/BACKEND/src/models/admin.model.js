// Importa conexión a MySQL
const { pool } = require('../config/db');

// Obtener todos los usuarios
const getUsuarios = async () => {
  const [rows] = await pool.query(`
    SELECT *
    FROM usuarios
    ORDER BY id DESC
  `); // consulta DB
  return rows; // devuelve datos
};

// Obtener todos los pedidos
const getPedidos = async () => {
  const [rows] = await pool.query(`
    SELECT *
    FROM pedidos
    ORDER BY id DESC
  `); // consulta DB
  return rows; // devuelve datos
};

// Obtener métricas (totales)
const getMetricas = async () => {
  const [[usuarios]] = await pool.query(`SELECT COUNT(*) AS total FROM usuarios`); // total usuarios
  const [[pedidos]] = await pool.query(`SELECT COUNT(*) AS total FROM pedidos`); // total pedidos
  const [[ventas]] = await pool.query(`
    SELECT COALESCE(SUM(total), 0) AS total 
    FROM pedidos 
    WHERE estado = 'pagado'
  `); // total ventas

  return {
    usuarios: usuarios.total,
    pedidos: pedidos.total,
    ventas: ventas.total
  }; // devuelve métricas
};

// Exporta funciones
module.exports = { getUsuarios, getPedidos, getMetricas };