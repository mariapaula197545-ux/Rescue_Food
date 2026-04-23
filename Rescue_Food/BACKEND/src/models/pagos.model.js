// Importa conexión DB
const { pool } = require('../config/db');

// Obtener pedido por ID
const getPedidoById = async (pedidoId) => {
  const [rows] = await pool.query(
    `
    SELECT id, usuario_id, total, estado
    FROM pedidos
    WHERE id = ?
    `,
    [pedidoId]
  ); // consulta pedido

  return rows[0]; // devuelve uno
};

// Obtener pago por pedido
const getPagoByPedido = async (pedidoId) => {
  const [rows] = await pool.query(
    `
    SELECT id, pedido_id, metodo_pago, referencia, monto, estado, creado_en
    FROM pagos
    WHERE pedido_id = ?
    `,
    [pedidoId]
  ); // consulta pago

  return rows[0]; // devuelve uno
};

// Crear pago
const createPago = async ({ pedido_id, metodo_pago, referencia, monto, estado }) => {
  const [result] = await pool.query(
    `
    INSERT INTO pagos (pedido_id, metodo_pago, referencia, monto, estado)
    VALUES (?, ?, ?, ?, ?)
    `,
    [pedido_id, metodo_pago, referencia ?? null, monto, estado ?? 'pagado']
  ); // inserta pago

  return result.insertId; // id creado
};

// Actualizar estado del pedido
const updatePedidoEstado = async (pedidoId, estado) => {
  const [result] = await pool.query(
    `
    UPDATE pedidos
    SET estado = ?
    WHERE id = ?
    `,
    [estado, pedidoId]
  ); // update pedido

  return result.affectedRows; // filas afectadas
};

// Exporta funciones
module.exports = {
  getPedidoById,
  getPagoByPedido,
  createPago,
  updatePedidoEstado
};