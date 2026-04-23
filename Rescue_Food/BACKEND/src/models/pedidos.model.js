// Importa conexión DB
const { pool } = require('../config/db');

// Trae productos del carrito para crear pedido
const getCartItemsForPedido = async (usuarioId) => {
  const [rows] = await pool.query(
    `
    SELECT
      ci.producto_id,
      ci.cantidad,
      p.nombre,
      p.precio,
      p.stock,
      p.disponible
    FROM carritos c
    INNER JOIN carrito_items ci ON ci.carrito_id = c.id
    INNER JOIN productos p ON p.id = ci.producto_id
    WHERE c.usuario_id = ?
    ORDER BY ci.id ASC
    `,
    [usuarioId]
  ); // consulta carrito

  return rows; // devuelve items
};

// Crear pedido
const createPedido = async (conn, { usuarioId, total, direccion_entrega, notas }) => {
  const [result] = await conn.query(
    `
    INSERT INTO pedidos (usuario_id, total, estado, direccion_entrega, notas)
    VALUES (?, ?, 'pendiente', ?, ?)
    `,
    [usuarioId, total, direccion_entrega ?? null, notas ?? null]
  ); // inserta pedido

  return result.insertId; // id creado
};

// Crear detalle del pedido
const createPedidoDetalle = async (conn, detalle) => {
  const [result] = await conn.query(
    `
    INSERT INTO pedido_detalles
      (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      detalle.pedido_id,
      detalle.producto_id,
      detalle.cantidad,
      detalle.precio_unitario,
      detalle.subtotal
    ]
  ); // inserta detalle

  return result.insertId; // id detalle
};

// Descontar stock del producto
const descontarStock = async (conn, productoId, cantidad) => {
  const [result] = await conn.query(
    `
    UPDATE productos
    SET stock = stock - ?
    WHERE id = ? AND stock >= ?
    `,
    [cantidad, productoId, cantidad]
  ); // descuenta stock

  return result.affectedRows; // filas afectadas
};

// Vaciar carrito en transacción
const clearCartTx = async (conn, usuarioId) => {
  await conn.query(
    `
    DELETE ci
    FROM carrito_items ci
    INNER JOIN carritos c ON c.id = ci.carrito_id
    WHERE c.usuario_id = ?
    `,
    [usuarioId]
  ); // elimina items
};

// Listar pedidos por usuario
const getPedidosByUsuario = async (usuarioId) => {
  const [rows] = await pool.query(
    `
    SELECT id, usuario_id, total, estado, direccion_entrega, notas, creado_en, actualizado_en
    FROM pedidos
    WHERE usuario_id = ?
    ORDER BY id DESC
    `,
    [usuarioId]
  ); // consulta pedidos

  return rows; // devuelve lista
};

// Obtener pedido por ID
const getPedidoById = async (pedidoId, usuarioId = null) => {
  let sql = `
    SELECT id, usuario_id, total, estado, direccion_entrega, notas, creado_en, actualizado_en
    FROM pedidos
    WHERE id = ?
  `;
  const params = [pedidoId];

  if (usuarioId) {
    sql += ' AND usuario_id = ?'; // filtra por usuario
    params.push(usuarioId);
  }

  const [rows] = await pool.query(sql, params); // consulta pedido
  return rows[0];
};

// Obtener detalles del pedido
const getPedidoDetalles = async (pedidoId) => {
  const [rows] = await pool.query(
    `
    SELECT
      pd.id,
      pd.producto_id,
      pd.cantidad,
      pd.precio_unitario,
      pd.subtotal,
      p.nombre,
      p.imagen_url
    FROM pedido_detalles pd
    INNER JOIN productos p ON p.id = pd.producto_id
    WHERE pd.pedido_id = ?
    ORDER BY pd.id ASC
    `,
    [pedidoId]
  ); // consulta detalles

  return rows; // devuelve detalles
};

// Actualizar estado del pedido
const updateEstado = async (pedidoId, estado) => {
  const [result] = await pool.query(
    `
    UPDATE pedidos
    SET estado = ?
    WHERE id = ?
    `,
    [estado, pedidoId]
  ); // update estado

  return result.affectedRows; // filas afectadas
};

// Exporta funciones y pool
module.exports = {
  getCartItemsForPedido,
  createPedido,
  createPedidoDetalle,
  descontarStock,
  clearCartTx,
  getPedidosByUsuario,
  getPedidoById,
  getPedidoDetalles,
  updateEstado,
  pool
};