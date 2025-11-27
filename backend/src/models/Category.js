import pool from '../database/connection.js';

export class Category {
  static async create(categoryData) {
    const { nombre, descripcion } = categoryData;
    const query = 'INSERT INTO categories (nombre, descripcion) VALUES (?, ?)';
    const [result] = await pool.execute(query, [nombre, descripcion]);
    return result.insertId;
  }

  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY nombre';
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const [rows] = await pool.execute(query, [parseInt(id)]);
    return rows[0] || null;
  }

  static async update(id, categoryData) {
    const { nombre, descripcion } = categoryData;
    const query = 'UPDATE categories SET nombre = ?, descripcion = ? WHERE id = ?';
    await pool.execute(query, [nombre || null, descripcion || null, parseInt(id)]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = ?';
    await pool.execute(query, [parseInt(id)]);
    return true;
  }
}

