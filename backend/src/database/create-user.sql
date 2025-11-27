-- Crear usuario Carlos Bastidas
USE inventario_ferreteria_bastidas;

INSERT INTO users (nombre, email, password, rol) 
VALUES (
  'Carlos Bastidas',
  'cebastidas@uniguajira.edu.co',
  '$2a$10$h2EmXKE4ftVoOHGHDCOKiehsKsiNTPsh4JmkkrYYImcmX.CU2hmEi',
  'Admin'
)
ON DUPLICATE KEY UPDATE 
  nombre = 'Carlos Bastidas',
  password = '$2a$10$h2EmXKE4ftVoOHGHDCOKiehsKsiNTPsh4JmkkrYYImcmX.CU2hmEi',
  rol = 'Admin';

