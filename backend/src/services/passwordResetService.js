import { User } from '../models/User.js';
import { sendPasswordResetCode, sendPasswordResetLink, generateResetCode, generateResetToken } from './emailService.js';

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const requestPasswordReset = async (email) => {
  try {
    // Validar que el email esté presente
    if (!email) {
      return { success: false, message: 'El correo electrónico es requerido' };
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return { success: false, message: 'El formato del correo electrónico no es válido' };
    }

    let user;
    try {
      user = await User.findByEmail(email);
    } catch (dbError) {
      console.error('Error de base de datos al buscar usuario:', dbError);
      return { success: false, message: 'Error al conectar con la base de datos. Por favor, intenta nuevamente más tarde.' };
    }
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { success: true, message: 'Si el correo está registrado, recibirás un mensaje con las instrucciones' };
    }

    if (!user.activo) {
      return { success: false, message: 'Tu cuenta está desactivada. Contacta al administrador.' };
    }

    // Siempre usar método por código primero
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // Expira en 15 minutos
    
    const resetCode = generateResetCode();
    
    try {
      await User.setResetCode(email, resetCode, expires);
    } catch (dbError) {
      console.error('Error de base de datos al guardar código de reset:', dbError);
      return { success: false, message: 'Error al procesar la solicitud. Por favor, intenta nuevamente.' };
    }
    
    let emailResult;
    try {
      emailResult = await sendPasswordResetCode(email, resetCode, user.nombre);
    } catch (emailError) {
      console.error('Error al enviar email (excepción):', emailError);
      return { 
        success: false, 
        message: 'Error al enviar el correo electrónico. Por favor, verifica la configuración del servidor o intenta nuevamente más tarde.' 
      };
    }
    
    if (!emailResult || !emailResult.success) {
      console.error('Error al enviar email:', emailResult?.error);
      // Proporcionar mensaje más específico basado en el tipo de error
      const errorMsg = emailResult?.error || 'Error desconocido';
      if (errorMsg.includes('autenticación') || errorMsg.includes('EAUTH')) {
        return { success: false, message: 'Error de configuración del servidor de correo. Contacta al administrador.' };
      } else if (errorMsg.includes('conexión') || errorMsg.includes('ECONNECTION')) {
        return { success: false, message: 'Error de conexión con el servidor de correo. Por favor, intenta nuevamente más tarde.' };
      } else if (errorMsg.includes('tiempo') || errorMsg.includes('ETIMEDOUT')) {
        return { success: false, message: 'Tiempo de espera agotado al enviar el correo. Por favor, intenta nuevamente.' };
      } else if (errorMsg.includes('incompleta')) {
        return { success: false, message: 'Configuración de correo electrónico incompleta. Contacta al administrador.' };
      }
      return { success: false, message: `Error al enviar el correo: ${errorMsg}. Por favor, intenta nuevamente.` };
    }
    
    return { success: true, message: 'Código de verificación enviado a tu correo electrónico' };
  } catch (error) {
    console.error('Error inesperado en requestPasswordReset:', error);
    console.error('Stack trace:', error.stack);
    return { success: false, message: 'Error inesperado al procesar la solicitud. Por favor, intenta nuevamente o contacta al administrador.' };
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    // Validar que el email y código estén presentes
    if (!email) {
      return { success: false, message: 'El correo electrónico es requerido' };
    }

    if (!code) {
      return { success: false, message: 'El código de verificación es requerido' };
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return { success: false, message: 'El formato del correo electrónico no es válido' };
    }

    // Validar formato del código (debe ser 6 dígitos)
    if (!/^\d{6}$/.test(code)) {
      return { success: false, message: 'El código de verificación debe tener 6 dígitos' };
    }

    let user;
    try {
      user = await User.findByEmail(email);
    } catch (dbError) {
      console.error('Error de base de datos al buscar usuario:', dbError);
      return { success: false, message: 'Error al conectar con la base de datos. Por favor, intenta nuevamente más tarde.' };
    }
    
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    let isValid;
    try {
      isValid = await User.verifyResetCode(email, code);
    } catch (dbError) {
      console.error('Error de base de datos al verificar código:', dbError);
      return { success: false, message: 'Error al verificar el código. Por favor, intenta nuevamente.' };
    }
    
    if (!isValid) {
      return { success: false, message: 'Código inválido o expirado. Por favor, solicita un nuevo código.' };
    }

    // Después de verificar el código, generar token y enviar link
    const resetToken = generateResetToken();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // Expira en 15 minutos
    
    // Guardar el token
    try {
      await User.setResetToken(email, resetToken, expires);
    } catch (dbError) {
      console.error('Error de base de datos al guardar token:', dbError);
      return { success: false, message: 'Error al procesar la solicitud. Por favor, intenta nuevamente.' };
    }
    
    // Enviar el link por email
    const emailResult = await sendPasswordResetLink(email, resetToken, user.nombre);
    
    if (!emailResult.success) {
      console.error('Error al enviar email con link:', emailResult.error);
      // Proporcionar mensaje más específico
      if (emailResult.error && emailResult.error.includes('autenticación')) {
        return { success: false, message: 'Error de configuración del servidor de correo. Contacta al administrador.' };
      } else if (emailResult.error && emailResult.error.includes('conexión')) {
        return { success: false, message: 'Error de conexión con el servidor de correo. Por favor, intenta nuevamente más tarde.' };
      }
      return { success: false, message: `Error al enviar el enlace de recuperación: ${emailResult.error || 'Error desconocido'}. Por favor, intenta nuevamente.` };
    }
    
    // Limpiar el código ya que fue verificado
    try {
      await User.clearResetCode(user.id);
    } catch (dbError) {
      console.error('Error al limpiar código (no crítico):', dbError);
      // No fallar si no se puede limpiar el código
    }
    
    return { 
      success: true, 
      message: 'Código verificado correctamente. Se ha enviado un enlace de recuperación a tu correo electrónico.',
      token: resetToken // Opcional, para debugging
    };
  } catch (error) {
    console.error('Error inesperado en verifyResetCode:', error);
    console.error('Stack trace:', error.stack);
    return { success: false, message: 'Error inesperado al verificar el código. Por favor, intenta nuevamente o contacta al administrador.' };
  }
};

// Esta función ya no se usa, se mantiene por compatibilidad pero el flujo ahora es: código -> link -> reset
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

