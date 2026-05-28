// Importa modelo tiendas públicas
const model = require('../models/tiendas.public.model');

// Listar todas las tiendas
const getAll = async (req, res) => {
  try {
    const data = await model.getAll(); // consulta DB
    res.json({ ok: true, data }); // respuesta ok
  } catch (err) {
    // Captura cualquier falla del servidor o de la base de datos al listar y responde con código 500
    res.status(500).json({ ok: false, msg: err.message }); // error
  }
};

// Obtener tienda por ID
const getById = async (req, res) => {
  try {
    const data = await model.getById(req.params.id); // consulta DB
    if (!data) return res.status(404).json({ ok: false, msg: 'No encontrada' });

    res.json({ ok: true, data }); // ok
  } catch (err) {
    // Captura fallas al buscar una tienda específica por ID y devuelve el error con estado HTTP 500
    res.status(500).json({ ok: false, msg: err.message }); // error
  }
};

// Obtener productos de una tienda
const getProductos = async (req, res) => {
  try {
    const data = await model.getProductosByTienda(req.params.id); // consulta productos
    res.json({ ok: true, data }); // ok
  } catch (err) {
    // Captura errores durante la extracción del catálogo de la tienda y responde con código 500
    res.status(500).json({ ok: false, msg: err.message }); // error
  }
};

// Exporta controladores
module.exports = { getAll, getById, getProductos };