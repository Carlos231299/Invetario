import pool from '../database/connection.js';
import { Product } from '../models/Product.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Total de productos
    const [productsCount] = await pool.execute('SELECT COUNT(*) as total FROM products WHERE activo = TRUE');
    
    // Productos con stock bajo
    const lowStockProducts = await Product.getLowStock();
    
    // Total de categorías
    const [categoriesCount] = await pool.execute('SELECT COUNT(*) as total FROM categories');
    
    // Total de proveedores
    const [suppliersCount] = await pool.execute('SELECT COUNT(*) as total FROM suppliers');
    
    // Valor total del inventario
    const [inventoryValue] = await pool.execute(`
      SELECT SUM(stock * precio_compra) as total 
      FROM products 
      WHERE activo = TRUE
    `);
    
    // Movimientos recientes (últimos 10)
    const [recentMovements] = await pool.execute(`
      SELECT 
        m.*,
        p.nombre as producto_nombre,
        p.codigo as producto_codigo,
        u.nombre as usuario_nombre
      FROM movements m
      LEFT JOIN products p ON m.producto_id = p.id
      LEFT JOIN users u ON m.usuario_id = u.id
      ORDER BY m.fecha DESC
      LIMIT 10
    `);
    
    // Entradas y salidas del mes actual
    const [monthEntries] = await pool.execute(`
      SELECT SUM(cantidad) as total 
      FROM entries 
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) 
      AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `);
    
    const [monthExits] = await pool.execute(`
      SELECT SUM(cantidad) as total 
      FROM exits 
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) 
      AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `);

    res.json({
      success: true,
      data: {
        productos: {
          total: productsCount[0].total,
          stockBajo: lowStockProducts.length
        },
        categorias: categoriesCount[0].total,
        proveedores: suppliersCount[0].total,
        inventario: {
          valorTotal: inventoryValue[0].total || 0
        },
        movimientos: {
          recientes: recentMovements,
          mesActual: {
            entradas: monthEntries[0].total || 0,
            salidas: monthExits[0].total || 0
          }
        },
        productosStockBajo: lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

