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
    const filters = {
      producto_id: req.query.producto_id,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };
    const entries = await Entry.findAll(filters);
    res.json({ success: true, data: entries });
  } catch (error) {
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

