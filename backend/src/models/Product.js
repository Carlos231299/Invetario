import pool from '../database/connection.js';

export class Product {
  static async create(productData) {
    const { codigo, nombre, descripcion, categoria_id, proveedor_id, stock, stock_minimo, precio_compra, precio_venta } = productData;
    const query = `
      INSERT INTO products (codigo, nombre, descripcion, categoria_id, proveedor_id, stock, stock_minimo, precio_compra, precio_venta)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      codigo, nombre, descripcion, categoria_id, proveedor_id, 
      stock || 0, stock_minimo || 0, precio_compra || 0, precio_venta || 0
    ]);
    return result.insertId;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        s.nombre as proveedor_nombre
      FROM products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      LEFT JOIN suppliers s ON p.proveedor_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      query += ' AND (p.nombre LIKE ? OR p.codigo LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.categoria_id) {
      query += ' AND p.categoria_id = ?';
      params.push(filters.categoria_id);
    }

    if (filters.proveedor_id) {
      query += ' AND p.proveedor_id = ?';
      params.push(filters.proveedor_id);
    }

    if (filters.stock_bajo !== undefined) {
      query += ' AND p.stock <= p.stock_minimo';
    }

    query += ' ORDER BY p.nombre';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        s.nombre as proveedor_nombre
      FROM products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      LEFT JOIN suppliers s ON p.proveedor_id = s.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByCode(codigo) {
    const query = 'SELECT * FROM products WHERE codigo = ?';
    const [rows] = await pool.execute(query, [codigo]);
    return rows[0] || null;
  }

  static async update(id, productData) {
    const { nombre, descripcion, categoria_id, proveedor_id, stock, stock_minimo, precio_compra, precio_venta, activo } = productData;
    const query = `
      UPDATE products 
      SET nombre = ?, descripcion = ?, categoria_id = ?, proveedor_id = ?, 
          stock = ?, stock_minimo = ?, precio_compra = ?, precio_venta = ?, activo = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      nombre, descripcion, categoria_id, proveedor_id,
      stock, stock_minimo, precio_compra, precio_venta, activo, id
    ]);
    return true;
  }

  static async updateStock(id, cantidad) {
    const query = 'UPDATE products SET stock = stock + ? WHERE id = ?';
    await pool.execute(query, [cantidad, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    await pool.execute(query, [id]);
    return true;
  }

  static async getLowStock() {
    const query = `
      SELECT * FROM products 
      WHERE stock <= stock_minimo AND activo = TRUE
      ORDER BY (stock - stock_minimo) ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }
}

