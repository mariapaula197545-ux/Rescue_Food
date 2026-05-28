const multer = require('multer'); // Importa la librería multer para gestionar la subida de fotos de perfil
const path = require('path'); // Módulo nativo de Node.js utilizado para extraer las extensiones de los archivos

const storage = multer.diskStorage({ // Configura el método de almacenamiento en el disco duro del servidor

  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Especifica que las imágenes de perfil se guardarán en la carpeta 'uploads'
  },

  filename: (req, file, cb) => {

    // Crea un nombre único usando el tiempo actual en milisegundos y le concatena la extensión (.png, .jpg, etc.)
    const nombre =
      Date.now() +
      path.extname(file.originalname);

    cb(null, nombre); // Retorna el nombre único final para evitar conflictos de archivos duplicados
  }

});

const upload = multer({
  storage // Inicializa el cargador asociando la configuración de guardado definida arriba
});

module.exports = upload; // Exporta el middleware para usarlo en las rutas de actualización de usuario o tiendas