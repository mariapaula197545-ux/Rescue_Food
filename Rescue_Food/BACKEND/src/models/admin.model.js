// Importa conexión a MySQL
const { pool } = require('../config/db'); // Importa el pool de conexiones configurado para interactuar con MySQL

// Obtener todos los usuarios
const getUsuarios = async () => {
  const [rows] = await pool.query(`
    SELECT *
    FROM usuarios
    ORDER BY id DESC
  `); // Ejecuta la consulta SQL y aplica destructuración para obtener solo las filas con los registros
  return rows; // devuelve datos
};

// Obtener todos los pedidos
const getPedidos = async () => {
  const [rows] = await pool.query(`
    SELECT *
    FROM pedidos
    ORDER BY id DESC
  `); // Consulta la tabla de pedidos organizando los más recientes primero (DESC)
  return rows; // devuelve datos
};

// Obtener métricas (totales)
const getMetricas = async () => {
  const [[usuarios]] = await pool.query(`SELECT COUNT(*) AS total FROM usuarios`); // Doble destructuración para extraer directamente el objeto de la primera fila
  const [[pedidos]] = await pool.query(`SELECT COUNT(*) AS total FROM pedidos`); // Cuenta la cantidad total de pedidos registrados en el sistema
  const [[ventas]] = await pool.query(`
    SELECT COALESCE(SUM(total), 0) AS total 
    FROM pedidos 
    WHERE estado = 'pagado'
  `); // Suma los ingresos usando COALESCE para que devuelva 0 en lugar de NULL si no hay ventas realizadas

  return {
    usuarios: usuarios.total,
    pedidos: pedidos.total,
    ventas: ventas.total
  }; // Retorna un objeto unificado con las tres estadísticas clave para el dashboard de administración
};

// Exporta funciones
module.exports = { getUsuarios, getPedidos, getMetricas };