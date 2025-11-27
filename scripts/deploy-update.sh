#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"
APP_DIR="/var/www/inventario-ferreteria-bastidas"

if [ ! -f "$PEM_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo $PEM_FILE"
    exit 1
fi

ssh_exec() {
    ssh -i "$PEM_FILE" \
        -F /dev/null \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=30 \
        -o ServerAliveInterval=60 \
        -o ServerAliveCountMax=3 \
        "$SERVER" "$1"
}

echo "🚀 Actualización rápida iniciada..."

# Actualizar código desde GitHub
echo "📥 Actualizando código desde GitHub..."
ssh_exec "cd $APP_DIR && git pull origin main"

# Backend - solo instalar si hay cambios en package.json
echo "🔧 Actualizando backend..."
ssh_exec "cd $APP_DIR/backend && npm install --production"

# Verificar que MySQL esté corriendo
echo "🔍 Verificando MySQL..."
ssh_exec "sudo systemctl start mysql 2>/dev/null || true"
ssh_exec "sleep 1"

# Verificar que el .env existe y tiene las variables necesarias
echo "🔍 Verificando configuración..."
ssh_exec "cd $APP_DIR/backend && if [ ! -f .env ]; then
  echo '⚠️  Advertencia: Archivo .env no encontrado, creando uno nuevo...'
  JWT_SECRET=\$(openssl rand -base64 32)
  JWT_REFRESH_SECRET=\$(openssl rand -base64 32)
  cat > .env <<EOF
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=inventario_ferreteria_bastidas
JWT_SECRET=\$JWT_SECRET
JWT_REFRESH_SECRET=\$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cbastidas52@gmail.com
EMAIL_PASS=ujqs qsdi bcma zzqj
EMAIL_FROM=cbastidas52@gmail.com
FRONTEND_URL=http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com
EOF
fi"

# Reiniciar backend con PM2
echo "🔄 Reiniciando backend..."
ssh_exec "cd $APP_DIR/backend && pm2 restart inventario-backend"
ssh_exec "sleep 2"
ssh_exec "pm2 logs inventario-backend --lines 10 --nostream || true"

# Frontend - solo construir si hay cambios
echo "🔧 Actualizando frontend..."
ssh_exec "cd $APP_DIR/frontend && npm install && VITE_API_URL=http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com/api npm run build"

# Actualizar archivos del frontend
echo "📦 Desplegando frontend..."
ssh_exec "sudo rm -rf /var/www/html/inventario && sudo mkdir -p /var/www/html/inventario && sudo cp -r $APP_DIR/frontend/dist/* /var/www/html/inventario/ && sudo chown -R www-data:www-data /var/www/html/inventario"

# Recargar Nginx
echo "🔄 Recargando Nginx..."
ssh_exec "sudo nginx -t && sudo systemctl reload nginx"

echo "✅ Actualización completada exitosamente!"

