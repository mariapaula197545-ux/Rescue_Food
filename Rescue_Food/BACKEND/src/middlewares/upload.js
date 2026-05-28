const multer = require('multer'); // Importa la librería multer para gestionar la subida de archivos al servidor

const storage = multer.diskStorage({ // Configura el almacenamiento físico de los archivos en el disco duro

  destination: (req, file, cb) => {

    cb(null, 'uploads/'); // Define la carpeta 'uploads' como el destino donde se guardarán las imágenes

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + '-' + file.originalname
    ); // Renombra el archivo anteponiendo la fecha actual en milisegundos para evitar nombres duplicados

  }

});

const upload = multer({
  storage // Inicializa el middleware pasándole la configuración de almacenamiento definida arriba
});

module.exports = upload; // Exporta el middleware listo para ser usado en las rutas que reciban imágenes o logos