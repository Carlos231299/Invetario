import { User } from '../models/User.js';
import { sendPasswordResetCode, generateResetCode } from './emailService.js';

export const requestPasswordReset = async (email) => {
  const user = await User.findByEmail(email);
  
  if (!user) {
    // Solo enviamos códigos a usuarios registrados
    return { success: false, message: 'El correo no está registrado en el sistema' };
  }

  const resetCode = generateResetCode();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 15); // Expira en 15 minutos

  await User.setResetCode(email, resetCode, expires);
  await sendPasswordResetCode(email, resetCode, user.nombre);

  return { success: true, message: 'Código de recuperación enviado a tu correo electrónico' };
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

