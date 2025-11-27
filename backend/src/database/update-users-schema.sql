-- Actualizar tabla users para agregar campos de reset_code
USE inventario_ferreteria_bastidas;

-- Agregar campos reset_code y reset_code_expires si no existen
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_code VARCHAR(6) NULL AFTER reset_token_expires,
ADD COLUMN IF NOT EXISTS reset_code_expires DATETIME NULL AFTER reset_code;

