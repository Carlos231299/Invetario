import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const userId = await User.create({ nombre, email, password, rol: rol || 'Operador' });
    const user = await User.findById(userId);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    await User.update(id, req.body);
    const updatedUser = await User.findById(id);
    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (id === req.user.id) {
      throw new AppError('No puedes desactivar tu propio usuario', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Alternar estado: si está activo, desactivar; si está inactivo, activar
    const nuevoEstado = !user.activo;
    await User.update(id, { 
      nombre: user.nombre, 
      email: user.email, 
      rol: user.rol, 
      activo: nuevoEstado 
    });
    
    res.json({
      success: true,
      message: nuevoEstado ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente',
      data: { activo: nuevoEstado }
    });
  } catch (error) {
    next(error);
  }
};

