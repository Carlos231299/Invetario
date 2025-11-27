import { Exit } from '../models/Exit.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createExit = async (req, res, next) => {
  try {
    const exitData = {
      ...req.body,
      usuario_id: req.user.id
    };
    const exitId = await Exit.create(exitData);
    const exit = await Exit.findById(exitId);
    res.status(201).json({
      success: true,
      message: 'Salida registrada correctamente',
      data: exit
    });
  } catch (error) {
    next(error);
  }
};

export const getExits = async (req, res, next) => {
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
    
    const exits = await Exit.findAll(filters);
    res.json({ success: true, data: exits });
  } catch (error) {
    console.error('Error en getExits:', error);
    next(error);
  }
};

export const getExit = async (req, res, next) => {
  try {
    const exit = await Exit.findById(req.params.id);
    if (!exit) {
      throw new AppError('Salida no encontrada', 404);
    }
    res.json({ success: true, data: exit });
  } catch (error) {
    next(error);
  }
};

