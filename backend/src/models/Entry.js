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
      // Asegurar que los valores sean del tipo correcto y válidos
      const productId = parseInt(producto_id);
      const cantidadNum = parseInt(cantidad);
      const userId = parseInt(usuario_id);
      
      if (isNaN(productId) || isNaN(cantidadNum) || isNaN(userId)) {
        throw new Error('Parámetros inválidos: producto_id, cantidad y usuario_id deben ser números válidos');
      }
      
      const params = [
        productId,
        cantidadNum,
        userId,
        observaciones || null
      ];
      const [result] = await connection.execute(query, params);

      // Actualizar stock del producto
      await connection.execute(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [parseInt(cantidad), parseInt(producto_id)]
      );

      // Registrar en bitácora
      await logMovement('entrada', productId, cantidadNum, userId, `Entrada: ${observaciones || 'Sin observaciones'}`);

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

    if (filters.producto_id && !isNaN(parseInt(filters.producto_id))) {
      query += ' AND e.producto_id = ?';
      params.push(parseInt(filters.producto_id));
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
    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;
    
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

