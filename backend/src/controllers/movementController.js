import { getMovements } from '../utils/logger.js';

export const getMovementsController = async (req, res, next) => {
  try {
    const filters = {
      tipo: req.query.tipo,
      producto_id: req.query.producto_id ? parseInt(req.query.producto_id) : undefined,
      usuario_id: req.query.usuario_id ? parseInt(req.query.usuario_id) : undefined,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };
    const movements = await getMovements(filters);
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
};

