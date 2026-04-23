// Importa MySQL con async/await
const mysql = require('mysql2/promise');

// Carga variables .env
require('dotenv').config();

// Crea pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // host DB
  port: Number(process.env.DB_PORT || 3306), // puerto
  user: process.env.DB_USER || 'root', // usuario
  password: process.env.DB_PASSWORD || '', // contraseña
  database: process.env.DB_NAME || 'rescue_food', // DB
  connectionLimit: Number(process.env.DB_POOL_LIMIT || 10), // conexiones max
  waitForConnections: true, // espera si no hay conexión
  queueLimit: 0 // sin límite de cola
});

// Prueba conexión a MySQL
const testConnection = async () => {
  const connection = await pool.getConnection(); // toma conexión
  try {
    console.log('MySQL conectado correctamente'); // ok
  } finally {
    connection.release(); // libera conexión
  }
};

// Exporta pool y prueba
module.exports = {
  pool,
  testConnection
};