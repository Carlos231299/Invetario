import { logMovement } from '../utils/logger.js';

export const logProductCreation = async (productoId, usuarioId) => {
  await logMovement('creacion', productoId, 0, usuarioId, 'Producto creado');
};

export const logProductUpdate = async (productoId, usuarioId, detalle) => {
  await logMovement('actualizacion', productoId, 0, usuarioId, detalle);
};

export const logProductDeletion = async (productoId, usuarioId) => {
  await logMovement('eliminacion', productoId, 0, usuarioId, 'Producto eliminado');
};

export const logStockAdjustment = async (productoId, cantidad, usuarioId, detalle) => {
  await logMovement('ajuste', productoId, cantidad, usuarioId, detalle);
};

