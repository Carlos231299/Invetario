import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../config/jwt.js';
import { requestPasswordReset, verifyResetCode, resetPassword } from '../services/passwordResetService.js';
import { AppError } from '../middlewares/errorHandler.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email y contraseña son requeridos', 400);
    }

    const user = await User.findByEmail(email);

    if (!user || !user.activo) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValidPassword = await User.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = generateToken({ id: user.id, email: user.email, rol: user.rol });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    
    if (!result.success) {
      throw new AppError(result.message, 400);
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const result = await verifyResetCode(email, code);
    
    if (!result.success) {
      throw new AppError(result.message, 400);
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    const result = await resetPassword(email, code, password);
    
    if (!result.success) {
      throw new AppError(result.message, 400);
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

