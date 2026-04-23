// Conexión DB
const { pool } = require('../config/db');

// Asegura carrito (si no existe, lo crea)
const ensureCart = async (usuarioId) => {
  const [rows] = await pool.query(
    'SELECT * FROM carritos WHERE usuario_id = ?',
    [usuarioId]
  );

  if (rows[0]) return rows[0]; // ya existe

  const [result] = await pool.query(
    'INSERT INTO carritos (usuario_id) VALUES (?)',
    [usuarioId]
  );

  return { id: result.insertId, usuario_id: Number(usuarioId) }; // nuevo carrito
};

// Obtener carrito completo
const getCartByUsuarioId = async (usuarioId) => {
  const cart = await ensureCart(usuarioId); // asegura carrito

  const [items] = await pool.query(`
    SELECT ci.*, p.nombre, p.precio, p.stock, p.disponible,
           (ci.cantidad * p.precio) AS subtotal
    FROM carrito_items ci
    INNER JOIN productos p ON p.id = ci.producto_id
    WHERE ci.carrito_id = ?
  `, [cart.id]); // trae items

  const total = items.reduce((acc, i) => acc + Number(i.subtotal), 0); // total

  return { carrito: cart, items, total };
};

// Buscar item específico
const getItemByCartAndProducto = async (carritoId, productoId) => {
  const [rows] = await pool.query(
    'SELECT * FROM carrito_items WHERE carrito_id = ? AND producto_id = ?',
    [carritoId, productoId]
  );
  return rows[0];
};

// Buscar producto
const getProductoById = async (productoId) => {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE id = ?',
    [productoId]
  );
  return rows[0];
};

// Agregar producto (o sumar cantidad)
const addItem = async (usuarioId, productoId, cantidad) => {
  const cart = await ensureCart(usuarioId);

  await pool.query(`
    INSERT INTO carrito_items (carrito_id, producto_id, cantidad)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
  `, [cart.id, productoId, cantidad]);

  return getCartByUsuarioId(usuarioId); // carrito actualizado
};

// Actualizar cantidad
const updateItem = async (usuarioId, productoId, cantidad) => {
  const cart = await ensureCart(usuarioId);

  const [result] = await pool.query(
    'UPDATE carrito_items SET cantidad = ? WHERE carrito_id = ? AND producto_id = ?',
    [cantidad, cart.id, productoId]
  );

  return result.affectedRows;
};

// Eliminar producto
const removeItem = async (usuarioId, productoId) => {
  const cart = await ensureCart(usuarioId);

  const [result] = await pool.query(
    'DELETE FROM carrito_items WHERE carrito_id = ? AND producto_id = ?',
    [cart.id, productoId]
  );

  return result.affectedRows;
};

// Vaciar carrito
const clearCart = async (usuarioId) => {
  const cart = await ensureCart(usuarioId);

  await pool.query(
    'DELETE FROM carrito_items WHERE carrito_id = ?',
    [cart.id]
  );

  return true;
};

// Exporta funciones
module.exports = {
  ensureCart,
  getCartByUsuarioId,
  getItemByCartAndProducto,
  getProductoById,
  addItem,
  updateItem,
  removeItem,
  clearCart
};