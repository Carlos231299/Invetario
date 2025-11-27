import { Entry } from '../models/Entry.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createEntry = async (req, res, next) => {
  try {
    const entryData = {
      ...req.body,
      usuario_id: req.user.id
    };
    const entryId = await Entry.create(entryData);
    const entry = await Entry.findById(entryId);
    res.status(201).json({
      success: true,
      message: 'Entrada registrada correctamente',
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const filters = {};
    
    // Solo agregar filtros si existen y son válidos
    if (req.query.producto_id && !isNaN(parseInt(req.query.producto_id))) {
      filters.producto_id = parseInt(req.query.producto_id);
    }
    
    if (req.query.fecha_desde) {
      filters.fecha_desde = req.query.fecha_desde;
    }
    
    if (req.query.fecha_hasta) {
      filters.fecha_hasta = req.query.fecha_hasta;
    }
    
    // Asegurar que limit y offset sean números válidos
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    filters.limit = (!isNaN(limit) && limit > 0) ? limit : 50;
    filters.offset = (!isNaN(offset) && offset >= 0) ? offset : 0;
    
    const entries = await Entry.findAll(filters);
    res.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error en getEntries:', error);
    next(error);
  }
};

export const getEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      throw new AppError('Entrada no encontrada', 404);
    }
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

