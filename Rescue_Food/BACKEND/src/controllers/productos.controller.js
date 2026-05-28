
const ProductoModel = require('../models/productos.model');
const CategoriaModel = require('../models/categorias.model');

// =====================================
// LISTAR
// =====================================
const getAll = async (req, res) => {
  try {
    const data = await ProductoModel.getAll({});
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// =====================================
// POR ID
// =====================================
const getById = async (req, res) => {
  try {
    const data = await ProductoModel.getById(req.params.id);

    // Validación: Detiene el flujo si no existe un registro con el ID solicitado
    if (!data) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// =====================================
// MIS PRODUCTOS
// =====================================
const getMine = async (req, res) => {
  try {
    // Recupera el ID del usuario autenticado inyectado por el middleware de sesión
    const usuarioId = req.usuario.id;

    // Obtiene únicamente los productos pertenecientes a la tienda del usuario logueado
    const data = await ProductoModel.getByUsuarioTienda(usuarioId);

    return res.status(200).json(data);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// =====================================
// CREAR
// =====================================
const create = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const {
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      disponible,
      vence_en 
    } = req.body;

    // Validación: Verifica que los campos indispensables para el catálogo no lleguen vacíos
    if (!categoria_id || !nombre || !precio) {
      return res.status(400).json({
        ok: false,
        msg: 'Campos obligatorios'
      });
    }

    // Busca la tienda vinculada al usuario para obtener su respectivo id de comercio
    const tienda = await ProductoModel.getTiendaIdByUsuarioId(usuarioId);

    // Validación: Evita registrar productos si el usuario no tiene una tienda asociada
    if (!tienda) {
      return res.status(404).json({
        ok: false,
        msg: 'Tienda no encontrada'
      });
    }

    // Comprueba en el modelo de categorías si el identificador enviado existe
    const categoria = await CategoriaModel.getById(categoria_id);

    // Validación: Cancela la creación si la categoría asignada no está registrada en el sistema
    if (!categoria) {
      return res.status(404).json({
        ok: false,
        msg: 'Categoria no existe'
      });
    }

    // =====================================
    // IMAGEN
    // =====================================
    let imagen_url = null;

    // Si el middleware de carga interceptó un archivo, estructura la ruta estática final
    if (req.file) {
      imagen_url = `/uploads/${req.file.filename}`;
    }

    // Pasamos el parámetro vence_en asegurando que sea un número
    const productoId = await ProductoModel.create({
      tienda_id: tienda.id,
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
      disponible,
      vence_en: vence_en ? Number(vence_en) : 1
    });

    // Recupera la información completa del producto recién creado para enviarlo de vuelta
    const data = await ProductoModel.getById(productoId);

    return res.status(201).json({
      ok: true,
      msg: 'Producto creado',
      data
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// =====================================
// UPDATE
// =====================================
const update = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    // Obtiene el estado actual del producto por su ID
    const producto = await ProductoModel.getById(id);

    // Validación: Asegura que el producto a modificar exista en la base de datos
    if (!producto) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    // Validación de Seguridad: Verifica que la tienda que intenta editar sea la dueña del producto
    if (String(producto.usuario_id) !== String(usuarioId)) {
      return res.status(403).json({
        ok: false,
        msg: 'No autorizado'
      });
    }

    // Extraemos de forma explícita todos los campos recibidos de FormData
    const {
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      disponible,
      vence_en
    } = req.body;

    // Estructuramos el objeto final asegurando la conversión del número
    const dataUpdate = {
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      disponible,
      vence_en: vence_en ? Number(vence_en) : null
    };

    // =====================================
    // IMAGEN
    // =====================================
    // Si la edición incluyó una nueva imagen, sobrescribe la propiedad en el objeto de actualización
    if (req.file) {
      dataUpdate.imagen_url = `/uploads/${req.file.filename}`;
    }

    // Ejecuta la actualización física en el modelo correspondientemente
    await ProductoModel.update(id, dataUpdate);

    // Obtiene los datos actualizados directo de la base de datos para responderle al cliente
    const updated = await ProductoModel.getById(id);

    return res.status(200).json({
      ok: true,
      msg: 'Producto actualizado',
      data: updated
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

// =====================================
// DELETE
// =====================================
const remove = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    // Busca la existencia real del producto antes de proceder
    const producto = await ProductoModel.getById(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    // Validación de Seguridad: Evita que un comercio borre los productos de otra tienda
    if (String(producto.usuario_id) !== String(usuarioId)) {
      return res.status(403).json({
        ok: false,
        msg: 'No authorized'
      });
    }

    // Ejecuta la baja lógica o física del ítem en la base de datos
    await ProductoModel.remove(id);

    return res.status(200).json({
      ok: true,
      msg: 'Producto eliminado'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  getMine,
  create,
  update,
  remove
};