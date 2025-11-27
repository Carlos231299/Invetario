import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }
    next();
  };
};

// Validaciones para autenticación
export const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
];

export const validateRegister = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Email inválido')
];

export const validateResetPassword = [
  body('email').isEmail().withMessage('Email inválido'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const validateVerifyCode = [
  body('email').isEmail().withMessage('Email inválido'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos')
];

// Validaciones para productos
export const validateProduct = [
  body('codigo').trim().notEmpty().withMessage('Código requerido'),
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock debe ser un número entero positivo'),
  body('stock_minimo').optional().isInt({ min: 0 }).withMessage('Stock mínimo debe ser un número entero positivo'),
  body('precio_compra').optional().isFloat({ min: 0 }).withMessage('Precio de compra inválido'),
  body('precio_venta').optional().isFloat({ min: 0 }).withMessage('Precio de venta inválido')
];

// Validaciones para categorías
export const validateCategory = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido')
];

// Validaciones para proveedores
export const validateSupplier = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('email').optional().isEmail().withMessage('Email inválido')
];

// Validaciones para entradas
export const validateEntry = [
  body('producto_id').isInt().withMessage('ID de producto inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser un número entero positivo')
];

// Validaciones para salidas
export const validateExit = [
  body('producto_id').isInt().withMessage('ID de producto inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser un número entero positivo'),
  body('motivo').trim().notEmpty().withMessage('Motivo requerido')
];

// Validaciones para usuarios
export const validateUser = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('rol').optional().isIn(['Admin', 'Operador']).withMessage('Rol inválido')
];

// Validaciones de parámetros
export const validateId = [
  param('id').isInt().withMessage('ID inválido')
];

