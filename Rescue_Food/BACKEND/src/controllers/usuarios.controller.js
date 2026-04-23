// Importa modelo usuarios
const UsuarioModel = require('../models/usuarios.model');

// Obtener usuario por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params; // id usuario
    const data = await UsuarioModel.getById(id); // consulta DB

    if (!data) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    return res.status(200).json({ ok: true, data }); // ok
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Actualizar usuario
const updateById = async (req, res) => {
  try {
    const { id } = req.params; // id usuario
    const { nombre, email, direccion, foto_perfil } = req.body; // datos

    const currentUser = await UsuarioModel.getById(id); // busca usuario
    if (!currentUser) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    if (email) {
      const duplicated = await UsuarioModel.findEmailInAnotherUser(email, id); // valida email
      if (duplicated) {
        return res.status(409).json({ ok: false, msg: 'Correo ya registrado' });
      }
    }

    await UsuarioModel.updateById(id, { nombre, email, direccion, foto_perfil }); // update DB
    const updatedUser = await UsuarioModel.getById(id); // trae actualizado

    return res.status(200).json({
      ok: true,
      msg: 'Perfil actualizado',
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Exporta controladores
module.exports = {
  getById,
  updateById
};