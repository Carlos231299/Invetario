import pool from '../database/connection.js';

export class Supplier {
  static async create(supplierData) {
    const { nombre, contacto, telefono, email, direccion } = supplierData;
    const query = `
      INSERT INTO suppliers (nombre, contacto, telefono, email, direccion)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [nombre, contacto, telefono, email, direccion]);
    return result.insertId;
  }

  static async findAll() {
    const query = 'SELECT * FROM suppliers ORDER BY nombre';
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM suppliers WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async update(id, supplierData) {
    const { nombre, contacto, telefono, email, direccion } = supplierData;
    const query = `
      UPDATE suppliers 
      SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?
      WHERE id = ?
    `;
    await pool.execute(query, [nombre, contacto, telefono, email, direccion, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM suppliers WHERE id = ?';
    await pool.execute(query, [id]);
    return true;
  }
}

