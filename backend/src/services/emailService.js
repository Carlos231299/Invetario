import { sendEmail } from '../config/email.js';

export const sendPasswordResetCode = async (email, resetCode) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #2563eb; padding: 20px; background-color: white; border: 2px solid #2563eb; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recuperación de Contraseña</h1>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña para el sistema de Inventario Ferretería Bastidas.</p>
          <p>Tu código de recuperación es:</p>
          <div class="code">${resetCode}</div>
          <div class="warning">
            <p><strong>⚠️ Importante:</strong></p>
            <ul>
              <li>Este código expirará en 15 minutos</li>
              <li>No compartas este código con nadie</li>
              <li>Si no solicitaste este cambio, ignora este correo</li>
            </ul>
          </div>
          <p>Ingresa este código en la página de recuperación de contraseña para continuar.</p>
        </div>
        <div class="footer">
          <p>Inventario Ferretería Bastidas</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, 'Código de Recuperación - Inventario Ferretería Bastidas', html);
};

export const generateResetCode = () => {
  // Genera un código de 6 dígitos
  return Math.floor(100000 + Math.random() * 900000).toString();
};

