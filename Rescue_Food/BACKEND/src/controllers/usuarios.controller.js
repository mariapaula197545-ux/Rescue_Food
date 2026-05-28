// src/controllers/usuarios.controller.js

const UsuarioModel =
  require('../models/usuarios.model'); // Importa el modelo para interactuar con la tabla de usuarios

// OBTENER USUARIO
const getById = async (req, res) => {

  try {

    const { id } = req.params; // Extrae el ID de los parámetros de la URL

    const data =
      await UsuarioModel.getById(id); // Busca el usuario en la base de datos por su ID

    if (!data) {

      return res.status(404).json({ // Retorna 404 si el usuario no existe
        ok: false,
        msg: 'Usuario no encontrado'
      });

    }

    return res.status(200).json({ // Responde con éxito enviando los datos del usuario encontrado
      ok: true,
      data
    });

  } catch (error) {

    // Captura cualquier error de lectura en la base de datos y responde con estado HTTP 500
    return res.status(500).json({
      ok: false,
      msg: error.message
    });

  }

};

// ACTUALIZAR USUARIO
const updateById = async (req, res) => {

  try {

    const { id } = req.params; // Extrae el ID del usuario a modificar desde la URL

    let {
      nombre,
      email,
      direccion
    } = req.body; // Recibe los nuevos datos desde el formulario del cliente

    const currentUser =
      await UsuarioModel.getById(id); // Consulta el estado actual del usuario antes de cambiarlo

    if (!currentUser) {

      return res.status(404).json({ // Valida que el usuario exista antes de editarlo
        ok: false,
        msg: 'Usuario no encontrado'
      });

    }

    // VALIDAR EMAIL
    if (email) {

      const duplicated =
        await UsuarioModel.findEmailInAnotherUser(
          email,
          id
        ); // Verifica que el nuevo correo no le pertenezca a otra cuenta diferente

      if (duplicated) {

        return res.status(409).json({ // Retorna error de conflicto (409) si el correo ya está ocupado
          ok: false,
          msg: 'Correo ya registrado'
        });

      }

    }

    // FOTO PERFIL
    let foto_perfil =
      currentUser.foto_perfil; // Mantiene la foto actual por defecto si no se sube una nueva

    if (req.file) {

      foto_perfil =
        `/uploads/${req.file.filename}`; // Guarda la ruta del nuevo archivo si el cliente subió una imagen

    }

    // UPDATE
    await UsuarioModel.updateById(
      id,
      {
        nombre,
        email,
        direccion,
        foto_perfil
      }
    ); // Ejecuta la actualización de los campos en la base de datos

    const updatedUser =
      await UsuarioModel.getById(id); // Trae los datos recién actualizados para confirmar los cambios

    return res.status(200).json({ // Responde con éxito enviando el perfil fresco modificado

      ok: true,

      msg: 'Perfil actualizado',

      data: updatedUser

    });

  } catch (error) {

    // Captura fallas en el procesamiento de actualización o archivos del perfil y responde con código 500
    return res.status(500).json({
      ok: false,
      msg: error.message
    });

  }

};

module.exports = {
  getById,
  updateById
};
