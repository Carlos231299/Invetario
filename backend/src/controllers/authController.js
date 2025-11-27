import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../config/jwt.js';
import { requestPasswordReset, verifyResetCode, resetPassword, resetPasswordByToken } from '../services/passwordResetService.js';
import { AppError } from '../middlewares/errorHandler.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email y contraseña son requeridos', 400);
    }

    let user;
    try {
      user = await User.findByEmail(email);
    } catch (dbError) {
      console.error('Error al buscar usuario:', dbError);
      throw new AppError('Error al conectar con la base de datos', 500);
    }

    if (!user || !user.activo) {
      throw new AppError('Credenciales inválidas', 401);
    }

    let isValidPassword;
    try {
      isValidPassword = await User.verifyPassword(password, user.password);
    } catch (passwordError) {
      console.error('Error al verificar contraseña:', passwordError);
      throw new AppError('Error al verificar credenciales', 500);
    }

    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    let token, refreshToken;
    try {
      token = generateToken({ id: user.id, email: user.email, rol: user.rol });
      refreshToken = generateRefreshToken({ id: user.id });
    } catch (tokenError) {
      console.error('Error al generar token:', tokenError);
      throw new AppError('Error al generar token de autenticación', 500);
    }

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

// Validar formato de email
const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validar que el email esté presente
    if (!email) {
      throw new AppError('El correo electrónico es requerido', 400);
    }

    // Validar formato de email
    if (!isValidEmailFormat(email)) {
      throw new AppError('El formato del correo electrónico no es válido', 400);
    }

    let result;
    try {
      result = await requestPasswordReset(email);
    } catch (serviceError) {
      console.error('Error en requestPasswordReset:', serviceError);
      // Si el servicio lanza un error, capturarlo y devolver un mensaje apropiado
      throw new AppError(
        serviceError.message || 'Error al procesar la solicitud de recuperación. Por favor, intenta nuevamente.',
        500
      );
    }
    
    if (!result || !result.success) {
      // El servicio ya proporciona mensajes descriptivos
      const errorMessage = result?.message || 'Error al procesar la solicitud. Por favor, intenta nuevamente.';
      throw new AppError(errorMessage, result?.statusCode || 400);
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    // Si ya es un AppError, pasarlo directamente
    if (error instanceof AppError) {
      return next(error);
    }
    // Para otros errores, loggear y devolver mensaje genérico
    console.error('Error inesperado en forgotPassword:', error);
    console.error('Stack trace:', error.stack);
    next(new AppError('Error inesperado al procesar la solicitud. Por favor, intenta nuevamente.', 500));
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // Validar que el email esté presente
    if (!email) {
      throw new AppError('El correo electrónico es requerido', 400);
    }

    // Validar que el código esté presente
    if (!code) {
      throw new AppError('El código de verificación es requerido', 400);
    }

    // Validar formato de email
    if (!isValidEmailFormat(email)) {
      throw new AppError('El formato del correo electrónico no es válido', 400);
    }

    // Validar formato del código (debe ser 6 dígitos)
    if (!/^\d{6}$/.test(code)) {
      throw new AppError('El código de verificación debe tener 6 dígitos', 400);
    }

    const result = await verifyResetCode(email, code);
    
    if (!result.success) {
      // El servicio ya proporciona mensajes descriptivos
      throw new AppError(result.message, 400);
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    // Si ya es un AppError, pasarlo directamente
    if (error instanceof AppError) {
      return next(error);
    }
    // Para otros errores, loggear y devolver mensaje genérico
    console.error('Error inesperado en verifyCode:', error);
    next(new AppError('Error inesperado al verificar el código. Por favor, intenta nuevamente.', 500));
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { email, code, token, password } = req.body;
    
    let result;
    if (token) {
      // Restablecer por token (link)
      result = await resetPasswordByToken(token, password);
    } else if (email && code) {
      // Restablecer por código
      result = await resetPassword(email, code, password);
    } else {
      throw new AppError('Se requiere token o código de verificación', 400);
    }
    
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

