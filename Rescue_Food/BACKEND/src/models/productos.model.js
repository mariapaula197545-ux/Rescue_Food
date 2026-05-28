// Importa conexión DB
const { pool } = require('../config/db');

// LISTAR PRODUCTOS CON FILTROS
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
      p.vence_en,
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
  `; // Construye la consulta base uniendo productos con sus categorías y tiendas respectivas

  const params = []; // Arreglo dinámico para almacenar los valores de los filtros aplicados

  if (categoriaId) {
    sql += ' AND p.categoria_id = ?'; // Añade filtro por categoría si se recibe en los parámetros
    params.push(categoriaId);
  }

  if (tiendaId) {
    sql += ' AND p.tienda_id = ?'; // Añade filtro para mostrar solo los productos de un comercio específico
    params.push(tiendaId);
  }

  if (disponible !== undefined && disponible !== '') {
    sql += ' AND p.disponible = ?'; // Valida la disponibilidad convirtiendo el valor a número (0 o 1)
    params.push(Number(disponible));
  }

  if (search) {
    sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)'; // Permite buscar coincidencias parciales por texto
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY p.id DESC'; // Organiza el catálogo dinámico mostrando primero los últimos productos agregados

  const [rows] = await pool.query(sql, params); // Ejecuta la consulta estructurada con su lista final de parámetros
  return rows; // devuelve lista
};

// OBTENER PRODUCTO POR ID
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
      p.vence_en,
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
  ); // Obtiene la ficha técnica de un único producto cruzando los datos del comercio dueño

  return rows[0]; // devuelve uno
};

// PRODUCTOS DE LA TIENDA DEL USUARIO
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
      p.vence_en,
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
  ); // Filtra el catálogo usando el ID del usuario administrador asociado a la tienda

  return rows;
};

// OBTENER TIENDA POR USUARIO
const getTiendaIdByUsuarioId = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT id, usuario_id, nombre_tienda
     FROM tiendas
     WHERE usuario_id = ?`,
    [usuarioId]
  ); // Retorna los datos mínimos del local del usuario para gestionar sus productos
  return rows[0];
};

// CREAR PRODUCTO
const create = async ({
  tienda_id,
  categoria_id,
  nombre,
  descripcion,
  precio,
  stock,
  imagen_url,
  disponible,
  vence_en
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO productos
      (tienda_id, categoria_id, nombre, descripcion, precio, stock, imagen_url, disponible, vence_en)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      tienda_id,
      categoria_id,
      nombre,
      descripcion ?? null,
      precio,
      stock ?? 0,
      imagen_url ?? null,
      disponible ?? 1,
      vence_en ?? 1 // Asigna un valor de respaldo por defecto si el campo llega vacío
    ]
  ); // Inserta el nuevo registro usando el operador de fusión nula (??) para controlar opcionales

  return result.insertId; // id creado
};

// ACTUALIZAR PRODUCTO
const update = async (
  id,
  { categoria_id, nombre, descripcion, precio, stock, imagen_url, disponible, vence_en }
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
        disponible = COALESCE(?, disponible),
        vence_en = COALESCE(?, vence_en)
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
      vence_en ?? null,
      id
    ]
  ); // Aplica COALESCE en SQL para mantener el valor existente si el parámetro llega como NULL

  return result.affectedRows; // filas afectadas
};

// ELIMINAR PRODUCTO
const remove = async (id) => {
  const [result] = await pool.query(
    `DELETE FROM productos WHERE id = ?`,
    [id]
  ); // Ejecuta el borrado físico del registro seleccionado por su clave primaria
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