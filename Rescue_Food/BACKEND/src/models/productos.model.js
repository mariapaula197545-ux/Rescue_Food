// Importa conexión DB
const { pool } = require('../config/db');

// Listar productos con filtros
const getAll = async ({ categoriaId, tiendaId, disponible, search }) => {
  let sql = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.imagen_url,
      p.disponible,
      p.creado_en,
      p.actualizado_en,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      t.id AS tienda_id,
      t.nombre_tienda
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    INNER JOIN tiendas t ON t.id = p.tienda_id
    WHERE 1 = 1
  `; // base consulta

  const params = []; // parámetros SQL

  if (categoriaId) {
    sql += ' AND p.categoria_id = ?'; // filtra categoría
    params.push(categoriaId);
  }

  if (tiendaId) {
    sql += ' AND p.tienda_id = ?'; // filtra tienda
    params.push(tiendaId);
  }

  if (disponible !== undefined && disponible !== '') {
    sql += ' AND p.disponible = ?'; // filtra disponibilidad
    params.push(Number(disponible));
  }

  if (search) {
    sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)'; // búsqueda
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY p.id DESC'; // ordena

  const [rows] = await pool.query(sql, params); // ejecuta consulta
  return rows; // devuelve lista
};

// Obtener producto por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.imagen_url,
      p.disponible,
      p.creado_en,
      p.actualizado_en,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      t.id AS tienda_id,
      t.usuario_id,
      t.nombre_tienda
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    INNER JOIN tiendas t ON t.id = p.tienda_id
    WHERE p.id = ?
    `,
    [id]
  ); // busca producto

  return rows[0]; // devuelve uno
};

// Productos de la tienda del usuario
const getByUsuarioTienda = async (usuarioId) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.imagen_url,
      p.disponible,
      p.creado_en,
      p.actualizado_en,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      t.id AS tienda_id,
      t.nombre_tienda
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    INNER JOIN tiendas t ON t.id = p.tienda_id
    WHERE t.usuario_id = ?
    ORDER BY p.id DESC
    `,
    [usuarioId]
  ); // productos por usuario

  return rows;
};

// Obtener tienda por usuario
const getTiendaIdByUsuarioId = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT id, usuario_id, nombre_tienda
     FROM tiendas
     WHERE usuario_id = ?`,
    [usuarioId]
  ); // busca tienda

  return rows[0];
};

// Crear producto
const create = async ({
  tienda_id,
  categoria_id,
  nombre,
  descripcion,
  precio,
  stock,
  imagen_url,
  disponible
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO productos
      (tienda_id, categoria_id, nombre, descripcion, precio, stock, imagen_url, disponible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      tienda_id,
      categoria_id,
      nombre,
      descripcion ?? null,
      precio,
      stock ?? 0,
      imagen_url ?? null,
      disponible ?? 1
    ]
  ); // inserta producto

  return result.insertId; // id creado
};

// Actualizar producto
const update = async (
  id,
  { categoria_id, nombre, descripcion, precio, stock, imagen_url, disponible }
) => {
  const [result] = await pool.query(
    `
    UPDATE productos
    SET categoria_id = COALESCE(?, categoria_id),
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        precio = COALESCE(?, precio),
        stock = COALESCE(?, stock),
        imagen_url = COALESCE(?, imagen_url),
        disponible = COALESCE(?, disponible)
    WHERE id = ?
    `,
    [
      categoria_id ?? null,
      nombre ?? null,
      descripcion ?? null,
      precio ?? null,
      stock ?? null,
      imagen_url ?? null,
      disponible ?? null,
      id
    ]
  ); // update parcial

  return result.affectedRows; // filas afectadas
};

// Eliminar producto
const remove = async (id) => {
  const [result] = await pool.query(
    `DELETE FROM productos WHERE id = ?`,
    [id]
  ); // delete producto

  return result.affectedRows;
};

// Exporta funciones
module.exports = {
  getAll,
  getById,
  getByUsuarioTienda,
  getTiendaIdByUsuarioId,
  create,
  update,
  remove
};