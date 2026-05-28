const multer = require('multer'); // Importa la librería multer para gestionar la subida de imágenes
const path = require('path'); // Módulo nativo de Node.js para manejar extensiones de archivos

const storage = multer.diskStorage({ // Configura el almacenamiento en el disco del servidor
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define que las imágenes se guardarán en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    // Genera un nombre único usando los milisegundos actuales y mantiene la extensión original (.jpg, .png, etc.)
    const nombre = Date.now() + path.extname(file.originalname);
    cb(null, nombre); // Retorna el nombre limpio final asignado al archivo
  }
});

const upload = multer({ storage }); // Inicializa el middleware con la configuración de arriba

module.exports = upload; // Exporta el cargador para aplicarlo en las rutas