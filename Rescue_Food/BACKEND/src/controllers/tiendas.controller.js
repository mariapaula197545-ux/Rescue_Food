const TiendaModel = require('../models/tiendas.model');

// GET TIENDA
const getByUsuarioId = async (req, res) => {
  try {
    const { usuario_id } = req.params; // Coincide con :usuario_id de la ruta
    const data = await TiendaModel.getByUsuarioId(usuario_id);

    // Validación: Detiene el flujo si la tienda no existe en el sistema
    if (!data) {
      return res.status(404).json({
        ok: false,
        msg: 'Tienda no encontrada'
      });
    }

    // Retorna los datos comerciales completos del comercio consultado
    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    // Captura cualquier falla del servidor o de la base de datos y responde con código 500
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// UPDATE TIENDA
const updateByUsuarioId = async (req, res) => {
  try {
    const { usuario_id } = req.params; // Coincide con :usuario_id de la ruta
    const {
      nombre,
      email,
      nombre_tienda,
      telefono,
      direccion,
      horario
    } = req.body;

    // Buscar la tienda actual usando el parámetro correcto
    const currentTienda = await TiendaModel.getByUsuarioId(usuario_id);
    
    // Validación de Existencia: Verifica que el comercio exista antes de alterarlo
    if (!currentTienda) {
      return res.status(404).json({
        ok: false,
        msg: 'Tienda no encontrada'
      });
    }

    // Gestionar el estado del logo_url
    let logo_url = currentTienda.logo_url;
    
    // Si la petición contiene un nuevo archivo de imagen, define su ruta de guardado
    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
    }

    // Validar si el email ya existe en otro usuario
    if (email) {
      const exists = await TiendaModel.emailExistsInAnotherUser(email, usuario_id);
      
      // Validación de Duplicidad: Cancela el proceso si el correo nuevo ya pertenece a otra cuenta
      if (exists) {
        return res.status(409).json({
          ok: false,
          msg: 'Correo ya registrado'
        });
      }
    }

    // Ejecutar el cambio estructural en la BD
    await TiendaModel.updateByUsuarioId(usuario_id, {
      nombre,
      email,
      nombre_tienda,
      telefono,
      direccion,
      horario,
      logo_url
    });

    // Obtener los datos frescos de la fila modificada
    const updated = await TiendaModel.getByUsuarioId(usuario_id);

    return res.status(200).json({
      ok: true,
      msg: 'Tienda actualizada con éxito',
      data: updated
    });

  } catch (error) {
    // Muestra la excepción en la consola del servidor y retorna el error con estado HTTP 500
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

module.exports = {
  getByUsuarioId,
  updateByUsuarioId
};
