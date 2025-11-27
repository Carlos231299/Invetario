#!/bin/bash

# Script optimizado para completar el despliegue
# Clona desde GitHub y configura todo

set -e

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"
APP_DIR="/var/www/inventario-ferreteria-bastidas"
GIT_REPO="https://github.com/Carlos231299/Invetario.git"
SERVER_URL="http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

if [ ! -f "$PEM_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo $PEM_FILE"
    exit 1
fi

echo "🚀 Completando despliegue en AWS..."

# Función para ejecutar comandos remotos
ssh_exec() {
    ssh -i "$PEM_FILE" -F /dev/null -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER" "$1"
}

echo "📥 Clonando repositorio desde GitHub..."
ssh_exec "command -v git >/dev/null 2>&1 || { echo 'Instalando Git...'; sudo apt-get update && sudo apt-get install -y git; }"
ssh_exec "sudo rm -rf $APP_DIR"
ssh_exec "sudo mkdir -p $APP_DIR"
ssh_exec "sudo chown -R ubuntu:ubuntu $APP_DIR"
ssh_exec "cd $APP_DIR && git clone $GIT_REPO ."

echo "🔧 Configurando backend..."

# Instalar dependencias del backend
echo "  - Instalando dependencias del backend..."
ssh_exec "cd $APP_DIR/backend && npm install --production"

# Crear .env desde .env.example
echo "  - Configurando variables de entorno..."
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
ssh_exec "pm2 startup systemd -u ubuntu --hp /home/ubuntu | sudo bash || true"

echo "🏗️  Construyendo frontend..."

# Instalar dependencias del frontend
echo "  - Instalando dependencias del frontend..."
ssh_exec "cd $APP_DIR/frontend && npm install"

# Build del frontend
echo "  - Construyendo frontend..."
ssh_exec "cd $APP_DIR/frontend && VITE_API_URL=$SERVER_URL/api npm run build"

# Mover dist al directorio de Nginx
echo "  - Desplegando frontend..."
ssh_exec "sudo rm -rf /var/www/html/inventario"
ssh_exec "sudo mkdir -p /var/www/html/inventario"
ssh_exec "sudo cp -r $APP_DIR/frontend/dist/* /var/www/html/inventario/"
ssh_exec "sudo chown -R www-data:www-data /var/www/html/inventario"

echo "🌐 Configurando Nginx..."

# Crear configuración de Nginx
ssh_exec "sudo tee /etc/nginx/sites-available/inventario > /dev/null <<'NGINXEOF'
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
        
        # Headers CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Manejar preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
NGINXEOF"

# Habilitar sitio
ssh_exec "sudo ln -sf /etc/nginx/sites-available/inventario /etc/nginx/sites-enabled/"
ssh_exec "sudo rm -f /etc/nginx/sites-enabled/default"

# Verificar y recargar Nginx
ssh_exec "sudo nginx -t && sudo systemctl reload nginx"

echo "✅ Despliegue completado exitosamente!"
echo "🌍 La aplicación está disponible en: http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

