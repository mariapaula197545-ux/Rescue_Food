const { pool } = require('../config/db');

// Obtener tienda por usuario_id
const getByUsuarioId = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT
        t.id,
        t.usuario_id,
        u.nombre,
        u.email,
        t.nombre_tienda,
        t.telefono,
        t.direccion,
        t.horario,
        t.logo_url,
        t.creada_en,
        t.actualizada_en
     FROM tiendas t
     INNER JOIN usuarios u ON u.id = t.usuario_id
     WHERE t.usuario_id = ?`,
    [usuario_id]
  ); // Cruza la tabla de tiendas con usuarios (INNER JOIN) para unificar los datos personales y del local comercial
  return rows[0];
};

// Validar email repetido omitiendo al usuario actual
const emailExistsInAnotherUser = async (email, usuario_id) => {
  const [rows] = await pool.query(
    `SELECT id FROM usuarios WHERE email = ? AND id <> ?`,
    [email, usuario_id]
  ); // Usa el operador de diferencia (<>) para verificar si el correo ya le pertenece a OTRAS cuentas
  return rows[0];
};

// Actualizar transaccional
const updateByUsuarioId = async (usuario_id, data) => {
  const connection = await pool.getConnection(); // Solicita una conexión dedicada del pool para manejar de forma segura la transacción
  try {
    await connection.beginTransaction(); // Inicia la transacción para asegurar que ambas tablas se actualicen juntas con éxito

    // Actualizar tabla usuarios
    await connection.query(
      `UPDATE usuarios
       SET nombre = COALESCE(?, nombre),
           email = COALESCE(?, email)
       WHERE id = ?`,
      [data.nombre ?? null, data.email ?? null, usuario_id]
    ); // Modifica los datos de autenticación del usuario usando COALESCE para omitir valores vacíos

    // Actualizar tabla tiendas
    const [result] = await connection.query(
      `UPDATE tiendas
       SET nombre_tienda = COALESCE(?, nombre_tienda),
           telefono = COALESCE(?, telefono),
           direccion = COALESCE(?, direccion),
           horario = COALESCE(?, horario),
           logo_url = COALESCE(?, logo_url)
       WHERE usuario_id = ?`,
      [
        data.nombre_tienda ?? null,
        data.telefono ?? null,
        data.direccion ?? null,
        data.horario ?? null,
        data.logo_url ?? null,
        usuario_id
      ]
    ); // Modifica de forma paralela la información comercial enlazada a ese mismo usuario

    await connection.commit(); // Si ninguna consulta falló, aplica y guarda de manera permanente todos los cambios en la BD
    return result.affectedRows;
  } catch (error) {
    await connection.rollback(); // En caso de cualquier error intermedio, cancela todo y restaura el estado original
    throw error;
  } finally {
    connection.release(); // Libera la conexión devolviéndola al pool para que quede disponible en el sistema
  }
};

module.exports = {
  getByUsuarioId,
  emailExistsInAnotherUser,
  updateByUsuarioId
};