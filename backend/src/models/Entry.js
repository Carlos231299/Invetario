import pool from '../database/connection.js';
import { logMovement } from '../utils/logger.js';

export class Entry {
  static async create(entryData) {
    const { producto_id, cantidad, usuario_id, observaciones } = entryData;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Crear entrada
      const query = `
        INSERT INTO entries (producto_id, cantidad, usuario_id, observaciones)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await connection.execute(query, [producto_id, cantidad, usuario_id, observaciones]);

      // Actualizar stock del producto
      await connection.execute(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [cantidad, producto_id]
      );

      // Registrar en bitácora
      await logMovement('entrada', producto_id, cantidad, usuario_id, `Entrada: ${observaciones || 'Sin observaciones'}`);

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT 
        e.*,
        p.nombre as producto_nombre,
        p.codigo as producto_codigo,
        u.nombre as usuario_nombre
      FROM entries e
      LEFT JOIN products p ON e.producto_id = p.id
      LEFT JOIN users u ON e.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.producto_id) {
      query += ' AND e.producto_id = ?';
      params.push(filters.producto_id);
    }

    if (filters.fecha_desde) {
      query += ' AND e.fecha >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += ' AND e.fecha <= ?';
      params.push(filters.fecha_hasta);
    }

    query += ' ORDER BY e.fecha DESC LIMIT ? OFFSET ?';
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        e.*,
        p.nombre as producto_nombre,
        p.codigo as producto_codigo,
        u.nombre as usuario_nombre
      FROM entries e
      LEFT JOIN products p ON e.producto_id = p.id
      LEFT JOIN users u ON e.usuario_id = u.id
      WHERE e.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }
}

