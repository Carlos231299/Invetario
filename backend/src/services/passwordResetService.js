import { User } from '../models/User.js';
import { sendPasswordResetEmail, generateResetToken } from './emailService.js';

export const requestPasswordReset = async (email) => {
  const user = await User.findByEmail(email);
  
  if (!user) {
    // Por seguridad, no revelamos si el email existe o no
    return { success: true, message: 'Si el email existe, se enviará un enlace de recuperación' };
  }

  const resetToken = generateResetToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Expira en 1 hora

  await User.setResetToken(email, resetToken, expires);
  await sendPasswordResetEmail(email, resetToken);

  return { success: true, message: 'Email de recuperación enviado' };
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findByResetToken(token);
  
  if (!user) {
    return { success: false, message: 'Token inválido o expirado' };
  }

  await User.updatePassword(user.id, newPassword);
  await User.clearResetToken(user.id);

  return { success: true, message: 'Contraseña restablecida correctamente' };
};

