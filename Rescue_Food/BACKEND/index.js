// Carga variables .env
require('dotenv').config();

// Importa app (Express)
const app = require('./src/app');

// Importa prueba de DB
const { testConnection } = require('./src/config/db');

// Puerto
const PORT = process.env.PORT || 3000;

// Inicia servidor
const startServer = async () => {
  try {
    await testConnection(); // verifica DB

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`); // OK
    });

  } catch (error) {
    console.error('Error:', error.message); // error
    process.exit(1); // detiene
  }
};

// Ejecuta servidor
startServer();