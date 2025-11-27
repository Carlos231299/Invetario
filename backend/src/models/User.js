import pool from '../database/connection.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create(userData) {
    const { nombre, email, password, rol = 'Operador' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (nombre, email, password, rol)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [nombre, email, hashedPassword, rol]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT id, nombre, email, rol, activo, created_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findAll() {
    const query = 'SELECT id, nombre, email, rol, activo, created_at FROM users ORDER BY nombre';
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async update(id, userData) {
    const { nombre, email, rol, activo } = userData;
    const query = `
      UPDATE users 
      SET nombre = ?, email = ?, rol = ?, activo = ?
      WHERE id = ?
    `;
    await pool.execute(query, [nombre, email, rol, activo, id]);
    return true;
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    await pool.execute(query, [hashedPassword, id]);
    return true;
  }

  static async setResetToken(email, token, expires) {
    const query = 'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?';
    await pool.execute(query, [token, expires, email]);
    return true;
  }

  static async setResetCode(email, code, expires) {
    const query = 'UPDATE users SET reset_code = ?, reset_code_expires = ? WHERE email = ?';
    await pool.execute(query, [code, expires, email]);
    return true;
  }

  static async findByResetToken(token) {
    const query = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()';
    const [rows] = await pool.execute(query, [token]);
    return rows[0] || null;
  }

  static async verifyResetCode(email, code) {
    const query = 'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()';
    const [rows] = await pool.execute(query, [email, code]);
    return rows.length > 0;
  }

  static async clearResetToken(id) {
    const query = 'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?';
    await pool.execute(query, [id]);
    return true;
  }

  static async clearResetCode(id) {
    const query = 'UPDATE users SET reset_code = NULL, reset_code_expires = NULL WHERE id = ?';
    await pool.execute(query, [id]);
    return true;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

