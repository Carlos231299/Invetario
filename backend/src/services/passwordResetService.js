import { User } from '../models/User.js';
import { sendPasswordResetCode, sendPasswordResetLink, generateResetCode, generateResetToken } from './emailService.js';

export const requestPasswordReset = async (email, method = 'code') => {
  try {
    const user = await User.findByEmail(email);
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { success: true, message: 'Si el correo está registrado, recibirás un mensaje con las instrucciones' };
    }

    if (!user.activo) {
      return { success: false, message: 'Tu cuenta está desactivada. Contacta al administrador.' };
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // Expira en 15 minutos

    if (method === 'link') {
      // Método por link
      const resetToken = generateResetToken();
      await User.setResetToken(email, resetToken, expires);
      const emailResult = await sendPasswordResetLink(email, resetToken, user.nombre);
      
      if (!emailResult.success) {
        console.error('Error al enviar email:', emailResult.error);
        return { success: false, message: 'Error al enviar el correo. Por favor, intenta nuevamente.' };
      }
      
      return { success: true, message: 'Enlace de recuperación enviado a tu correo electrónico' };
    } else {
      // Método por código (por defecto)
      const resetCode = generateResetCode();
      await User.setResetCode(email, resetCode, expires);
      const emailResult = await sendPasswordResetCode(email, resetCode, user.nombre);
      
      if (!emailResult.success) {
        console.error('Error al enviar email:', emailResult.error);
        return { success: false, message: 'Error al enviar el correo. Por favor, intenta nuevamente.' };
      }
      
      return { success: true, message: 'Código de recuperación enviado a tu correo electrónico' };
    }
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    return { success: false, message: 'Error al procesar la solicitud. Por favor, intenta nuevamente.' };
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
  try {
    if (!email || !code || !newPassword) {
      return { success: false, message: 'Email, código y nueva contraseña son requeridos' };
    }

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
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return { success: false, message: 'Error al restablecer la contraseña. Por favor, intenta nuevamente.' };
  }
};

export const resetPasswordByToken = async (token, newPassword) => {
  try {
    if (!token) {
      return { success: false, message: 'Token requerido' };
    }

    const user = await User.findByResetToken(token);
    
    if (!user) {
      return { success: false, message: 'Token inválido o expirado' };
    }

    await User.updatePassword(user.id, newPassword);
    await User.clearResetToken(user.id);

    return { success: true, message: 'Contraseña restablecida correctamente' };
  } catch (error) {
    console.error('Error en resetPasswordByToken:', error);
    return { success: false, message: 'Error al restablecer la contraseña. Por favor, intenta nuevamente.' };
  }
};

