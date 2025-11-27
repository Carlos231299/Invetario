import pool from '../database/connection.js';

export const logMovement = async (tipo, productoId, cantidad, usuarioId, detalle = null) => {
  try {
    const query = `
      INSERT INTO movements (tipo, producto_id, cantidad, fecha, usuario_id, detalle)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `;
    // Asegurar que los valores sean del tipo correcto
    const params = [
      tipo || null,
      productoId ? parseInt(productoId) : null,
      cantidad ? parseInt(cantidad) : null,
      usuarioId ? parseInt(usuarioId) : null,
      detalle || null
    ];
    await pool.execute(query, params);
  } catch (error) {
    console.error('Error al registrar movimiento en bitácora:', error);
    throw error; // Re-lanzar para que se maneje en el nivel superior
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
      params.push(parseInt(filters.producto_id));
    }

    if (filters.usuario_id) {
      query += ' AND m.usuario_id = ?';
      params.push(parseInt(filters.usuario_id));
    }

    if (filters.fecha_desde) {
      query += ' AND m.fecha >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += ' AND m.fecha <= ?';
      params.push(filters.fecha_hasta);
    }

    query += ' ORDER BY m.fecha DESC';
    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;
    query += ' LIMIT ? OFFSET ?';
    
    // Asegurar que limit y offset sean números válidos
    if (isNaN(limit) || limit < 0) {
      params.push(50, 0);
    } else if (isNaN(offset) || offset < 0) {
      params.push(limit, 0);
    } else {
      params.push(limit, offset);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    throw error;
  }
};

