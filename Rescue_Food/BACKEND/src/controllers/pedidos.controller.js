// Importa modelo pedidos
const PedidoModel = require('../models/pedidos.model');

// Crear pedido
const createPedido = async (req, res) => {
  const conn = await PedidoModel.pool.getConnection(); // toma conexión

  try {
    const { usuarioId } = req.params; // id usuario
    const { direccion_entrega, notas } = req.body; // datos pedido

    const cartItems = await PedidoModel.getCartItemsForPedido(usuarioId); // trae carrito

    if (!cartItems.length) {
      conn.release(); // libera conexión
      return res.status(400).json({
        ok: false,
        msg: 'El carrito está vacío'
      });
    }

    for (const item of cartItems) {
      if (!Number(item.disponible)) {
        conn.release(); // libera conexión
        return res.status(400).json({
          ok: false,
          msg: `El producto "${item.nombre}" no está disponible`
        });
      }

      if (Number(item.stock) < Number(item.cantidad)) {
        conn.release(); // libera conexión
        return res.status(400).json({
          ok: false,
          msg: `No hay stock suficiente para "${item.nombre}"`
        });
      }
    }

    const total = cartItems.reduce(
      (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
      0
    ); // calcula total

    await conn.beginTransaction(); // inicia transacción

    const pedidoId = await PedidoModel.createPedido(conn, {
      usuarioId,
      total,
      direccion_entrega,
      notas
    }); // crea pedido

    for (const item of cartItems) {
      const subtotal = Number(item.precio) * Number(item.cantidad); // subtotal item

      await PedidoModel.createPedidoDetalle(conn, {
        pedido_id: pedidoId,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal
      }); // guarda detalle

      const stockActualizado = await PedidoModel.descontarStock(
        conn,
        item.producto_id,
        item.cantidad
      ); // descuenta stock

      if (!stockActualizado) {
        throw new Error(`No se pudo descontar el stock del producto ${item.nombre}`);
      }
    }

    await PedidoModel.clearCartTx(conn, usuarioId); // vacía carrito

    await conn.commit(); // confirma cambios
    conn.release(); // libera conexión

    const pedido = await PedidoModel.getPedidoById(pedidoId, usuarioId); // trae pedido
    const detalles = await PedidoModel.getPedidoDetalles(pedidoId); // trae detalles

    return res.status(201).json({
      ok: true,
      msg: 'Pedido creado correctamente',
      data: {
        pedido,
        detalles
      }
    });
  } catch (error) {
    await conn.rollback(); // revierte cambios
    conn.release(); // libera conexión
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Listar pedidos por usuario
const getPedidosByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params; // id usuario
    const data = await PedidoModel.getPedidosByUsuario(usuarioId); // consulta DB

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Obtener pedido por id
const getPedidoById = async (req, res) => {
  try {
    const { usuarioId, pedidoId } = req.params; // ids

    const pedido = await PedidoModel.getPedidoById(pedidoId, usuarioId); // busca pedido
    if (!pedido) {
      return res.status(404).json({
        ok: false,
        msg: 'Pedido no encontrado'
      });
    }

    const detalles = await PedidoModel.getPedidoDetalles(pedidoId); // trae detalles

    return res.status(200).json({
      ok: true,
      data: {
        pedido,
        detalles
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Actualizar estado pedido
const updateEstado = async (req, res) => {
  try {
    const { pedidoId } = req.params; // id pedido
    const { estado } = req.body; // nuevo estado

    if (!estado) {
      return res.status(400).json({
        ok: false,
        msg: 'estado es obligatorio'
      });
    }

    const affected = await PedidoModel.updateEstado(pedidoId, estado); // actualiza DB

    if (!affected) {
      return res.status(404).json({
        ok: false,
        msg: 'Pedido no encontrado'
      });
    }

    const pedido = await PedidoModel.getPedidoById(pedidoId); // trae pedido actualizado

    return res.status(200).json({
      ok: true,
      msg: 'Estado actualizado correctamente',
      data: pedido
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error
  }
};

// Exporta controladores
module.exports = {
  createPedido,
  getPedidosByUsuario,
  getPedidoById,
  updateEstado
};