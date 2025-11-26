import pool from '../database/connection.js';

export const logMovement = async (tipo, productoId, cantidad, usuarioId, detalle = null) => {
  try {
    const query = `
      INSERT INTO movements (tipo, producto_id, cantidad, fecha, usuario_id, detalle)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `;
    await pool.execute(query, [tipo, productoId, cantidad, usuarioId, detalle]);
  } catch (error) {
    console.error('Error al registrar movimiento en bitácora:', error);
  }
};

export const getMovements = async (filters = {}) => {
  try {
    let query = `
      SELECT 
        m.*,
        p.nombre as producto_nombre,
        p.codigo as producto_codigo,
        u.nombre as usuario_nombre
      FROM movements m
      LEFT JOIN products p ON m.producto_id = p.id
      LEFT JOIN users u ON m.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.tipo) {
      query += ' AND m.tipo = ?';
      params.push(filters.tipo);
    }

    if (filters.producto_id) {
      query += ' AND m.producto_id = ?';
      params.push(filters.producto_id);
    }

    if (filters.usuario_id) {
      query += ' AND m.usuario_id = ?';
      params.push(filters.usuario_id);
    }

    if (filters.fecha_desde) {
      query += ' AND m.fecha >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += ' AND m.fecha <= ?';
      params.push(filters.fecha_hasta);
    }

    query += ' ORDER BY m.fecha DESC LIMIT ? OFFSET ?';
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    throw error;
  }
};

