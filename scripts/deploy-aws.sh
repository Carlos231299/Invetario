#!/bin/bash

# Script para desplegar el proyecto en AWS
# Conecta por SSH, instala dependencias, configura servicios

set -e

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"
APP_DIR="/var/www/inventario-ferreteria-bastidas"
LOCAL_DIR="$PROJECT_ROOT"

echo "🚀 Iniciando despliegue en AWS..."

# Verificar que existe el archivo PEM
if [ ! -f "$PEM_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo $PEM_FILE"
    exit 1
fi

# Función para ejecutar comandos remotos
ssh_exec() {
    ssh -i "$PEM_FILE" -F /dev/null -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER" "$1"
}

# Función para copiar archivos
scp_copy() {
    scp -i "$PEM_FILE" -F /dev/null -r -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$1" "$SERVER:$2"
}

echo "📦 Instalando dependencias del sistema..."

# Instalar Node.js si no existe
ssh_exec "command -v node >/dev/null 2>&1 || {
    echo 'Instalando Node.js...'
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
}"

# Instalar MySQL si no existe
ssh_exec "command -v mysql >/dev/null 2>&1 || {
    echo 'Instalando MySQL...'
    sudo apt-get update
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
}"

# Instalar PM2 si no existe
ssh_exec "command -v pm2 >/dev/null 2>&1 || {
    echo 'Instalando PM2...'
    sudo npm install -g pm2
}"

# Instalar Nginx si no existe
ssh_exec "command -v nginx >/dev/null 2>&1 || {
    echo 'Instalando Nginx...'
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
}"

echo "📁 Creando directorio de aplicación..."
ssh_exec "sudo mkdir -p $APP_DIR"
ssh_exec "sudo chown -R ubuntu:ubuntu $APP_DIR"

echo "📤 Subiendo archivos del proyecto..."

# Subir backend (sin node_modules - se instalarán en el servidor)
echo "  - Subiendo backend..."
ssh_exec "mkdir -p $APP_DIR/backend/src"
scp_copy "$LOCAL_DIR/backend/package.json" "$APP_DIR/backend/"
scp_copy "$LOCAL_DIR/backend/server.js" "$APP_DIR/backend/"
scp_copy "$LOCAL_DIR/backend/.env.example" "$APP_DIR/backend/"
scp_copy "$LOCAL_DIR/backend/src" "$APP_DIR/backend/"

# Subir frontend (sin node_modules - se instalarán en el servidor)
echo "  - Subiendo frontend..."
ssh_exec "mkdir -p $APP_DIR/frontend/src"
scp_copy "$LOCAL_DIR/frontend/package.json" "$APP_DIR/frontend/"
scp_copy "$LOCAL_DIR/frontend/vite.config.js" "$APP_DIR/frontend/"
scp_copy "$LOCAL_DIR/frontend/tailwind.config.js" "$APP_DIR/frontend/"
scp_copy "$LOCAL_DIR/frontend/postcss.config.js" "$APP_DIR/frontend/"
scp_copy "$LOCAL_DIR/frontend/index.html" "$APP_DIR/frontend/"
scp_copy "$LOCAL_DIR/frontend/src" "$APP_DIR/frontend/"
scp_copy "$LOCAL_DIR/frontend/public" "$APP_DIR/frontend/"

# Subir archivos de configuración
echo "  - Subiendo archivos de configuración..."
scp_copy "$LOCAL_DIR/scripts" "$APP_DIR/"
scp_copy "$LOCAL_DIR/README.md" "$APP_DIR/"

echo "🔧 Configurando backend..."

# Instalar dependencias del backend
ssh_exec "cd $APP_DIR/backend && npm install --production"

# Crear .env desde .env.example
SERVER_URL="http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com"
ssh_exec "cd $APP_DIR/backend && if [ ! -f .env ]; then cp .env.example .env; fi"
ssh_exec "cd $APP_DIR/backend && sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=$SERVER_URL|' .env"

# Configurar base de datos
echo "  - Configurando base de datos..."
ssh_exec "sudo mysql -e \"CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;\" || true"
ssh_exec "cd $APP_DIR/backend && sudo mysql inventario_ferreteria_bastidas < src/database/schema.sql || true"

# Configurar PM2
echo "  - Configurando PM2..."
ssh_exec "cd $APP_DIR/backend && pm2 delete inventario-backend || true"
ssh_exec "cd $APP_DIR/backend && pm2 start server.js --name inventario-backend"
ssh_exec "pm2 save"
ssh_exec "pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null | sudo bash || true"

echo "🏗️  Construyendo frontend..."

# Instalar dependencias del frontend
ssh_exec "cd $APP_DIR/frontend && npm install"

# Build del frontend
ssh_exec "cd $APP_DIR/frontend && VITE_API_URL=$SERVER_URL/api npm run build"

# Mover dist al directorio de Nginx
ssh_exec "sudo rm -rf /var/www/html/inventario"
ssh_exec "sudo mkdir -p /var/www/html/inventario"
ssh_exec "sudo cp -r $APP_DIR/frontend/dist/* /var/www/html/inventario/"

echo "🌐 Configurando Nginx..."

# Crear configuración de Nginx
ssh_exec "sudo tee /etc/nginx/sites-available/inventario > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    root /var/www/html/inventario;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF"

# Habilitar sitio
ssh_exec "sudo ln -sf /etc/nginx/sites-available/inventario /etc/nginx/sites-enabled/"
ssh_exec "sudo rm -f /etc/nginx/sites-enabled/default"

# Verificar y recargar Nginx
ssh_exec "sudo nginx -t && sudo systemctl reload nginx"

echo "✅ Despliegue completado exitosamente!"
echo "🌍 La aplicación está disponible en: http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

