// Importa modelo tiendas
const TiendaModel = require('../models/tiendas.model');

// Obtener tienda por usuario
const getByUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    const data = await TiendaModel.getByUsuarioId(usuarioId); // consulta DB

    if (!data) {
      return res.status(404).json({ ok: false, msg: 'Tienda no encontrada' });
    }

    return res.status(200).json({ ok: true, data }); // ok
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Actualizar tienda
const updateByUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    const { nombre, email } = req.body; // datos

    const tiendaActual = await TiendaModel.getByUsuarioId(usuarioId); // busca tienda
    if (!tiendaActual) {
      return res.status(404).json({ ok: false, msg: 'Tienda no encontrada' });
    }

    if (email) {
      const duplicated = await TiendaModel.emailExistsInAnotherUser(email, usuarioId); // valida email
      if (duplicated) {
        return res.status(409).json({ ok: false, msg: 'El correo ya está registrado' });
      }
    }

    await TiendaModel.updateByUsuarioId(usuarioId, req.body); // update DB
    const updatedStore = await TiendaModel.getByUsuarioId(usuarioId); // trae actualizado

    return res.status(200).json({
      ok: true,
      msg: 'Tienda actualizada',
      data: updatedStore
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Exporta controladores
module.exports = {
  getByUsuarioId,
  updateByUsuarioId
};