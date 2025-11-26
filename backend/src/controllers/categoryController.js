import { Category } from '../models/Category.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createCategory = async (req, res, next) => {
  try {
    const categoryId = await Category.create(req.body);
    const category = await Category.findById(categoryId);
    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }

    await Category.update(id, req.body);
    const updatedCategory = await Category.findById(id);
    res.json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }

    await Category.delete(id);
    res.json({
      success: true,
      message: 'Categoría eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

