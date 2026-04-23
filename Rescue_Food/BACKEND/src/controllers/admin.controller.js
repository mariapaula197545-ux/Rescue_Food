// Importa el modelo (acceso a la DB)
const model = require('../models/admin.model');

// GET usuarios
const getUsuarios = async (req, res) => {
  try {
    const data = await model.getUsuarios(); // consulta DB
    return res.status(200).json({ ok: true, data }); // responde ok
  } catch (err) {
    console.error('Error en getUsuarios:', err); // log error
    return res.status(500).json({ ok: false, msg: err.message }); // error 500
  }
};

// GET pedidos
const getPedidos = async (req, res) => {
  try {
    const data = await model.getPedidos(); // consulta DB
    return res.status(200).json({ ok: true, data }); // responde ok
  } catch (err) {
    console.error('Error en getPedidos:', err); // log error
    return res.status(500).json({ ok: false, msg: err.message }); // error 500
  }
};

// GET métricas
const getMetricas = async (req, res) => {
  try {
    const data = await model.getMetricas(); // consulta DB
    return res.status(200).json({ ok: true, data }); // responde ok
  } catch (err) {
    console.error('Error en getMetricas:', err); // log error
    return res.status(500).json({ ok: false, msg: err.message }); // error 500
  }
};

// Exporta controladores
module.exports = { getUsuarios, getPedidos, getMetricas };