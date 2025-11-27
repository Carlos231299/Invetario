#!/bin/bash
# Script para ejecutar en el servidor y configurar MySQL

sudo mysql <<EOF
CREATE USER IF NOT EXISTS 'inventario'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON inventario_ferreteria_bastidas.* TO 'inventario'@'localhost';
FLUSH PRIVILEGES;
EOF

cd /var/www/inventario-ferreteria-bastidas/backend
sed -i 's/DB_USER=root/DB_USER=inventario/' .env
pm2 restart inventario-backend

echo "✅ MySQL y .env actualizados correctamente"

