// Importa modelo tiendas públicas
const model = require('../models/tiendas.public.model');

// Listar todas las tiendas
const getAll = async (req, res) => {
  try {
    const data = await model.getAll(); // consulta DB
    res.json({ ok: true, data }); // respuesta ok
  } catch (err) {
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
    res.status(500).json({ ok: false, msg: err.message }); // error
  }
};

// Obtener productos de una tienda
const getProductos = async (req, res) => {
  try {
    const data = await model.getProductosByTienda(req.params.id); // consulta productos
    res.json({ ok: true, data }); // ok
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message }); // error
  }
};

// Exporta controladores
module.exports = { getAll, getById, getProductos };