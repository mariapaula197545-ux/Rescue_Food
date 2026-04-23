// Importa modelos (DB)
const ProductoModel = require('../models/productos.model');
const CategoriaModel = require('../models/categorias.model');

// Listar productos (con filtros)
const getAll = async (req, res) => {
  try {
    const { categoriaId, tiendaId, disponible, search } = req.query; // filtros

    const data = await ProductoModel.getAll({
      categoriaId,
      tiendaId,
      disponible,
      search
    }); // consulta DB

    return res.status(200).json({ ok: true, data }); // ok
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Obtener producto por ID
const getById = async (req, res) => {
  try {
    const data = await ProductoModel.getById(req.params.id); // consulta

    if (!data) {
      return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
    }

    return res.status(200).json({ ok: true, data }); // ok
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Productos de mi tienda
const getMine = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario

    const tienda = await ProductoModel.getTiendaIdByUsuarioId(usuarioId); // busca tienda
    if (!tienda) {
      return res.status(404).json({ ok: false, msg: 'La tienda no existe' });
    }

    const data = await ProductoModel.getByUsuarioTienda(usuarioId); // productos tienda

    return res.status(200).json({
      ok: true,
      tienda,
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Crear producto
const create = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    const { categoria_id, nombre, descripcion, precio, stock, imagen_url, disponible } = req.body; // datos

    if (!categoria_id || !nombre || precio === undefined) {
      return res.status(400).json({
        ok: false,
        msg: 'datos obligatorios'
      });
    }

    const tienda = await ProductoModel.getTiendaIdByUsuarioId(usuarioId); // valida tienda
    if (!tienda) {
      return res.status(404).json({ ok: false, msg: 'La tienda no existe' });
    }

    const categoria = await CategoriaModel.getById(categoria_id); // valida categoría
    if (!categoria) {
      return res.status(404).json({ ok: false, msg: 'La categoría no existe' });
    }

    const productoId = await ProductoModel.create({
      tienda_id: tienda.id,
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
      disponible
    }); // crea producto

    const data = await ProductoModel.getById(productoId); // trae creado

    return res.status(201).json({
      ok: true,
      msg: 'Producto creado',
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Actualizar producto
const update = async (req, res) => {
  try {
    const { usuarioId, id } = req.params; // ids
    const producto = await ProductoModel.getById(id); // busca producto

    if (!producto) {
      return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
    }

    if (String(producto.usuario_id) !== String(usuarioId)) {
      return res.status(403).json({
        ok: false,
        msg: 'No puedes editar otro producto'
      });
    }

    if (req.body.categoria_id) {
      const categoria = await CategoriaModel.getById(req.body.categoria_id); // valida categoría
      if (!categoria) {
        return res.status(404).json({ ok: false, msg: 'Categoría no existe' });
      }
    }

    await ProductoModel.update(id, req.body); // update DB
    const updated = await ProductoModel.getById(id); // trae actualizado

    return res.status(200).json({
      ok: true,
      msg: 'Producto actualizado',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Eliminar producto
const remove = async (req, res) => {
  try {
    const { usuarioId, id } = req.params; // ids
    const producto = await ProductoModel.getById(id); // busca producto

    if (!producto) {
      return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
    }

    if (String(producto.usuario_id) !== String(usuarioId)) {
      return res.status(403).json({
        ok: false,
        msg: 'No puedes eliminar otro producto'
      });
    }

    await ProductoModel.remove(id); // elimina DB

    return res.status(200).json({
      ok: true,
      msg: 'Producto eliminado'
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Exporta controladores
module.exports = {
  getAll,
  getById,
  getMine,
  create,
  update,
  remove
};