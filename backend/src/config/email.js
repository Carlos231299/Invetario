import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'cbastidas52@gmail.com',
    pass: process.env.EMAIL_PASS || 'ujqs qsdi bcma zzqj'
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    // Verificar configuración
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Configuración de email incompleta');
      return { success: false, error: 'Configuración de email incompleta' };
    }

    const info = await transporter.sendMail({
      from: `"Inventario Ferretería Bastidas" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      // Agregar configuración adicional para mejor compatibilidad
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });
    
    console.log('✅ Email enviado exitosamente');
    console.log('   - Para:', to);
    console.log('   - Asunto:', subject);
    console.log('   - MessageId:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:');
    console.error('   - Para:', to);
    console.error('   - Error:', error.message);
    console.error('   - Stack:', error.stack);
    
    // Retornar error más descriptivo
    let errorMessage = error.message;
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación. Verifica las credenciales de email.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Error de conexión con el servidor de email.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Tiempo de espera agotado al enviar el email.';
    }
    
    return { success: false, error: errorMessage };
  }
};

export default transporter;

