import { User } from '../models/User.js';
import { sendPasswordResetCode, sendPasswordResetLink, generateResetCode, generateResetToken } from './emailService.js';

export const requestPasswordReset = async (email, method = 'code') => {
  const user = await User.findByEmail(email);
  
  if (!user) {
    // Solo enviamos códigos/links a usuarios registrados
    return { success: false, message: 'El correo no está registrado en el sistema' };
  }

  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 15); // Expira en 15 minutos

  if (method === 'link') {
    // Método por link
    const resetToken = generateResetToken();
    await User.setResetToken(email, resetToken, expires);
    await sendPasswordResetLink(email, resetToken, user.nombre);
    return { success: true, message: 'Enlace de recuperación enviado a tu correo electrónico' };
  } else {
    // Método por código (por defecto)
    const resetCode = generateResetCode();
    await User.setResetCode(email, resetCode, expires);
    await sendPasswordResetCode(email, resetCode, user.nombre);
    return { success: true, message: 'Código de recuperación enviado a tu correo electrónico' };
  }
};

export const verifyResetCode = async (email, code) => {
  const user = await User.findByEmail(email);
  
  if (!user) {
    return { success: false, message: 'Usuario no encontrado' };
  }

  const isValid = await User.verifyResetCode(email, code);
  
  if (!isValid) {
    return { success: false, message: 'Código inválido o expirado' };
  }

  return { success: true, message: 'Código verificado correctamente' };
};

export const resetPassword = async (email, code, newPassword) => {
  const user = await User.findByEmail(email);
  
  if (!user) {
    return { success: false, message: 'Usuario no encontrado' };
  }

  const isValid = await User.verifyResetCode(email, code);
  
  if (!isValid) {
    return { success: false, message: 'Código inválido o expirado' };
  }

  await User.updatePassword(user.id, newPassword);
  await User.clearResetCode(user.id);

  return { success: true, message: 'Contraseña restablecida correctamente' };
};

export const resetPasswordByToken = async (token, newPassword) => {
  const user = await User.findByResetToken(token);
  
  if (!user) {
    return { success: false, message: 'Token inválido o expirado' };
  }

  await User.updatePassword(user.id, newPassword);
  await User.clearResetToken(user.id);

  return { success: true, message: 'Contraseña restablecida correctamente' };
};

