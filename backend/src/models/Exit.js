import pool from '../database/connection.js';
import { logMovement } from '../utils/logger.js';

export class Exit {
  static async create(exitData) {
    const { producto_id, cantidad, usuario_id, motivo, observaciones } = exitData;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Verificar stock disponible
      const [product] = await connection.execute(
        'SELECT stock FROM products WHERE id = ?',
        [producto_id]
      );

      if (!product[0] || product[0].stock < cantidad) {
        throw new Error('Stock insuficiente para esta salida');
      }

      // Crear salida
      const query = `
        INSERT INTO exits (producto_id, cantidad, usuario_id, motivo, observaciones)
        VALUES (?, ?, ?, ?, ?)
      `;
      // Asegurar que los valores sean del tipo correcto
      const params = [
        parseInt(producto_id),
        parseInt(cantidad),
        parseInt(usuario_id),
        motivo || null,
        observaciones || null
      ];
      const [result] = await connection.execute(query, params);

      // Actualizar stock del producto
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [cantidad, producto_id]
      );

      // Registrar en bitácora
      await logMovement('salida', producto_id, cantidad, usuario_id, `Salida: ${motivo} - ${observaciones || ''}`);

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
      FROM exits e
      LEFT JOIN products p ON e.producto_id = p.id
      LEFT JOIN users u ON e.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.producto_id) {
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
      FROM exits e
      LEFT JOIN products p ON e.producto_id = p.id
      LEFT JOIN users u ON e.usuario_id = u.id
      WHERE e.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }
}

