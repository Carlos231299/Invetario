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
    const filters = {
      producto_id: req.query.producto_id,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };
    const exits = await Exit.findAll(filters);
    res.json({ success: true, data: exits });
  } catch (error) {
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

