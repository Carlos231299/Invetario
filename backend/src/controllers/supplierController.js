import { Supplier } from '../models/Supplier.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createSupplier = async (req, res, next) => {
  try {
    const supplierId = await Supplier.create(req.body);
    const supplier = await Supplier.findById(supplierId);
    res.status(201).json({
      success: true,
      message: 'Proveedor creado correctamente',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
};

export const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      throw new AppError('Proveedor no encontrado', 404);
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      throw new AppError('Proveedor no encontrado', 404);
    }

    await Supplier.update(id, req.body);
    const updatedSupplier = await Supplier.findById(id);
    res.json({
      success: true,
      message: 'Proveedor actualizado correctamente',
      data: updatedSupplier
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      throw new AppError('Proveedor no encontrado', 404);
    }

    await Supplier.delete(id);
    res.json({
      success: true,
      message: 'Proveedor eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

