import { Product } from '../models/Product.js';
import { logProductCreation, logProductUpdate, logProductDeletion } from '../services/movementService.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Verificar si el código ya existe
    const existingProduct = await Product.findByCode(productData.codigo);
    if (existingProduct) {
      throw new AppError('El código del producto ya existe', 400);
    }

    const productId = await Product.create(productData);
    await logProductCreation(productId, req.user.id);
    
    const product = await Product.findById(productId);
    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      categoria_id: req.query.categoria_id,
      proveedor_id: req.query.proveedor_id,
      stock_bajo: req.query.stock_bajo === 'true'
    };
    const products = await Product.findAll(filters);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new AppError('Producto no encontrado', 404);
    }

    await Product.update(id, productData);
    await logProductUpdate(id, req.user.id, `Producto actualizado: ${JSON.stringify(productData)}`);
    
    const updatedProduct = await Product.findById(id);
    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    await Product.delete(id);
    await logProductDeletion(id, req.user.id);
    
    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.getLowStock();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

