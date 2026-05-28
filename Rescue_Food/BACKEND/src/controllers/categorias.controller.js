// Importa modelo categorías (DB)
const CategoriaModel = require('../models/categorias.model');

// Obtener todas las categorías
const getAll = async (req, res) => {
  try {
    const data = await CategoriaModel.getAll(); // consulta DB
    
    // Envía la lista completa de categorías obtenidas de la base de datos
    return res.status(200).json({ ok: true, data }); // respuesta ok
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Obtener categoría por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params; // id de la URL
    const data = await CategoriaModel.getById(id); // consulta DB

    // Validación: Si el resultado de la consulta es vacío o nulo, corta el flujo
    if (!data) {
      return res.status(404).json({ ok: false, msg: 'Categoría no encontrada' }); // no existe
    }

    // Envía los datos específicos de la categoría encontrada
    return res.status(200).json({ ok: true, data }); // respuesta ok
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Exporta controladores
module.exports = {
  getAll,
  getById
};