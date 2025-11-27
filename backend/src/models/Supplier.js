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
    const query = 'SELECT DISTINCT * FROM suppliers ORDER BY nombre';
    const [rows] = await pool.execute(query);
    // Asegurar que no haya duplicados por ID
    const uniqueSuppliers = [];
    const seenIds = new Set();
    for (const supplier of rows) {
      if (!seenIds.has(supplier.id)) {
        seenIds.add(supplier.id);
        uniqueSuppliers.push(supplier);
      }
    }
    return uniqueSuppliers;
  }

  static async findById(id) {
    const query = 'SELECT * FROM suppliers WHERE id = ?';
    const [rows] = await pool.execute(query, [parseInt(id)]);
    return rows[0] || null;
  }

  static async update(id, supplierData) {
    const { nombre, contacto, telefono, email, direccion } = supplierData;
    const query = `
      UPDATE suppliers 
      SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      nombre || null,
      contacto || null,
      telefono || null,
      email || null,
      direccion || null,
      parseInt(id)
    ]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM suppliers WHERE id = ?';
    await pool.execute(query, [parseInt(id)]);
    return true;
  }
}

