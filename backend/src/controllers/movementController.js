import { getMovements } from '../utils/logger.js';

export const getMovementsController = async (req, res, next) => {
  try {
    const filters = {};
    
    // Solo agregar filtros si existen y son válidos
    if (req.query.tipo) {
      filters.tipo = req.query.tipo;
    }
    
    if (req.query.producto_id && !isNaN(parseInt(req.query.producto_id))) {
      filters.producto_id = parseInt(req.query.producto_id);
    }
    
    if (req.query.usuario_id && !isNaN(parseInt(req.query.usuario_id))) {
      filters.usuario_id = parseInt(req.query.usuario_id);
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
    
    const movements = await getMovements(filters);
    res.json({ success: true, data: movements });
  } catch (error) {
    console.error('Error en getMovementsController:', error);
    next(error);
  }
};

