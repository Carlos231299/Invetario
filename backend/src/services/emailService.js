import { sendEmail } from '../config/email.js';
import crypto from 'crypto';

export const sendPasswordResetCode = async (email, resetCode, nombreUsuario = 'Usuario') => {
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
        .greeting { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recuperación de Contraseña</h1>
        </div>
        <div class="content">
          <p class="greeting">Hola ${nombreUsuario},</p>
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
          <p>Saludos,<br>Equipo de Inventario Ferretería Bastidas</p>
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

export const generateResetToken = () => {
  // Genera un token seguro de 32 caracteres hexadecimales
  return crypto.randomBytes(32).toString('hex');
};

export const sendPasswordResetLink = async (email, resetToken, nombreUsuario = 'Usuario') => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
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
        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
        .greeting { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .link { word-break: break-all; color: #2563eb; padding: 10px; background-color: white; border: 1px solid #e5e7eb; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recuperación de Contraseña</h1>
        </div>
        <div class="content">
          <p class="greeting">Hola ${nombreUsuario},</p>
          <p>Has solicitado restablecer tu contraseña para el sistema de Inventario Ferretería Bastidas.</p>
          <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
          </div>
          <p>O copia y pega este enlace en tu navegador:</p>
          <div class="link">${resetUrl}</div>
          <div class="warning">
            <p><strong>⚠️ Importante:</strong></p>
            <ul>
              <li>Este enlace expirará en 15 minutos</li>
              <li>El enlace es de un solo uso</li>
              <li>No compartas este enlace con nadie</li>
              <li>Si no solicitaste este cambio, ignora este correo</li>
            </ul>
          </div>
          <p>Saludos,<br>Equipo de Inventario Ferretería Bastidas</p>
        </div>
        <div class="footer">
          <p>Inventario Ferretería Bastidas</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, 'Enlace de Recuperación - Inventario Ferretería Bastidas', html);
};

