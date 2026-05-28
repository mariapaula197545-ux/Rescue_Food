// Importa modelo carrito (DB)
const CarritoModel = require('../models/carrito.model');

// Obtener carrito del usuario
const getCart = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    const data = await CarritoModel.getCartByUsuarioId(usuarioId); // consulta DB

    // Responde con éxito enviando los datos del carrito recuperados
    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Agregar producto al carrito
const addItem = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    const { producto_id, cantidad } = req.body; // datos body

    // Validación: Verifica que se reciba el identificador del producto
    if (!producto_id) {
      return res.status(400).json({
        ok: false,
        msg: 'producto_id es obligatorio'
      });
    }

    // Evalúa la cantidad recibida o asigna 1 por defecto usando cortocircuito
    const cantidadFinal = Number(cantidad || 1); // cantidad default 1
    
    // Validación: Evita que se inyecten cantidades negativas o iguales a cero
    if (cantidadFinal <= 0) {
      return res.status(400).json({
        ok: false,
        msg: 'La cantidad debe ser mayor a 0'
      });
    }

    const producto = await CarritoModel.getProductoById(producto_id); // busca producto
    
    // Validación: Verifica la existencia física del producto en la base de datos
    if (!producto) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    // Validación: Revisa el estado de disponibilidad comercial del producto
    if (!Number(producto.disponible)) {
      return res.status(400).json({
        ok: false,
        msg: 'El producto no está disponible'
      });
    }

    const data = await CarritoModel.addItem(usuarioId, producto_id, cantidadFinal); // agrega item

    return res.status(200).json({
      ok: true,
      msg: 'Producto agregado al carrito',
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Actualizar cantidad de producto
const updateItem = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params; // ids
    const { cantidad } = req.body; // nueva cantidad

    // Conversión de tipo y validación matemática de la nueva cantidad
    const cantidadFinal = Number(cantidad);
    if (!cantidadFinal || cantidadFinal <= 0) {
      return res.status(400).json({
        ok: false,
        msg: 'La cantidad debe ser mayor a 0'
      });
    }

    const affected = await CarritoModel.updateItem(usuarioId, productoId, cantidadFinal); // update DB

    // Validación: Comprueba si se modificó alguna fila en la base de datos
    if (!affected) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado en el carrito'
      });
    }

    const data = await CarritoModel.getCartByUsuarioId(usuarioId); // carrito actualizado

    return res.status(200).json({
      ok: true,
      msg: 'Cantidad actualizada',
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Eliminar producto del carrito
const removeItem = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params; // ids

    const affected = await CarritoModel.removeItem(usuarioId, productoId); // delete DB

    // Validación: Si no hubo filas afectadas, el producto no estaba en el carrito
    if (!affected) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado en el carrito'
      });
    }

    const data = await CarritoModel.getCartByUsuarioId(usuarioId); // carrito actualizado

    return res.status(200).json({
      ok: true,
      msg: 'Producto eliminado del carrito',
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Vaciar carrito
const clearCart = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    await CarritoModel.clearCart(usuarioId); // limpia DB

    return res.status(200).json({
      ok: true,
      msg: 'Carrito vaciado correctamente'
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Exporta controladores
module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};